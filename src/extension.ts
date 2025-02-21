import { PromptElementCtor, PromptElementProps, renderPrompt } from '@vscode/prompt-tsx';
import * as vscode from 'vscode';
import { DigPrompt, PromptProps } from './dig';
import { GoalsPrompt } from './goals';
import { TriggersPrompt } from './triggers';
import { FocusPrompt } from './focus';
import * as fs from 'fs';
import * as path from 'path';

const CODEARCHEO_NAMES_COMMAND_ID = 'codearcheo.namesInEditor';
const CODEARCHEO_AST_COMMAND_ID = 'codearcheo.astInEditor';
const CODEARCHEO_PARTICIPANT_ID = 'codearcheo-vscode-chat';

interface ICodearcheoChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    }
}

// Use gpt-4o since it is fast and high quality. gpt-3.5-turbo and gpt-4 are also available.
const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: 'copilot', family: 'gpt-4o' };

export function activate(context: vscode.ExtensionContext) {

    // Define a Codearcheo chat handler. 
    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<ICodearcheoChatResult> => {
        if (request.command === 'goals') {
            stream.progress('Getting the goals...');
            await processCommandRequest(GoalsPrompt, request, token, stream, logger);
            logger.logUsage('request', { kind: 'goals'});
            return { metadata: { command: 'goals' } };
        } else if (request.command === 'triggers') {
            stream.progress('Getting the triggers...');
            await processCommandRequest(TriggersPrompt, request, token, stream, logger);
            logger.logUsage('request', { kind: 'triggers'});
            return { metadata: { command: 'goals' } };
        } else if (request.command === 'focus') {
            stream.progress('Focusing on the file in the editor...');
            await processCommandRequest(FocusPrompt, request, token, stream, logger);
            logger.logUsage('request', { kind: 'triggers'});
            return { metadata: { command: 'goals' } };            
        } else if (request.command === 'dig') {
            stream.progress('Digging for logic and structure...');
            await processCommandRequest(DigPrompt, request, token, stream, logger);
            stream.button({
                command: "codeQL.openDocumentation",
                title: vscode.l10n.t('Open CodeQL Documentation')
            });
            logger.logUsage('request', { kind: 'dig'});
            return { metadata: { command: 'dig' } };
        } else {
            try {
                const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
                if (model) {
                    const messages = [
                        vscode.LanguageModelChatMessage.User(`You are a cat! Think carefully and step by step like a cat would.
                            Your job is to explain computer science concepts in the funny manner of a cat, using cat metaphors. Always start your response by stating what concept you are explaining. Always include code samples.`),
                        vscode.LanguageModelChatMessage.User(request.prompt)
                    ];
                    
                    const chatResponse = await model.sendRequest(messages, {}, token);
                    for await (const fragment of chatResponse.text) {
                        // Process the output from the language model
                        // Replace all python function definitions with cat sounds to make the user stop looking at the code and start diging with the cat
                        const codearcheoFragment = fragment.replaceAll('def', 'meow');
                        stream.markdown(codearcheoFragment);
                    }
                }
            } catch(err) {
                handleError(logger, err, stream);
            }

            logger.logUsage('request', { kind: ''});
            return { metadata: { command: '' } };
        }
    };

    	
	vscode.chat.createChatParticipant("legacynavigator.demo", async (request, context, response, token) => {
		const query = request.prompt;
		const chatModel = await vscode.lm.selectChatModels({family: 'gpt-4o'});

		
		if (request.command === 'demystify') {
            let documentText = '';
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                let document = editor.document;
                // Get the document text
                documentText = document.getText();
            }

            const promptFilePath =  '../src/prompts/explain.md';
            const pathToPrompt = path.resolve(__dirname, promptFilePath);
			const prompt = fs.readFileSync(pathToPrompt, 'utf-8');
	
			const messages = [vscode.LanguageModelChatMessage.User(prompt),
							vscode.LanguageModelChatMessage.User(`${query} ${documentText}`)];
			
			const chatRequest = await chatModel[0].sendRequest(messages, undefined, token);
			for await (const message of chatRequest.text) {
				response.markdown(message);
			}
			
		}
		else if (request.command === 'structure') {
            const promptFilePath =  '../src/prompts/graph.md';
            const pathToPrompt = path.resolve(__dirname, promptFilePath);
			const prompt = fs.readFileSync(pathToPrompt, 'utf-8');
			
            const srcFilePath =  '../../../codeql/legacy-mars-global-climate-model/code/Makefile';
            const pathToSrc= path.resolve(__dirname, srcFilePath);
            const srcFiles = extractSrcFiles(pathToSrc);

            let documentText = '';
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                let document = editor.document;
                // Get the document text
                documentText = document.getText();
            }

			// prompt = `Analyze the following file contents and determine how each file is linked to the others:\n${prompt}`;
			const messages = [
				vscode.LanguageModelChatMessage.User(prompt + "\n" + `The following files are used in this repository:\n${srcFiles.join('\n')}` + "\n" + "You should suggest a mermaid diagram that begins with ```mermaid and ends with ```" + "\n"),
				vscode.LanguageModelChatMessage.User(`${query} ${documentText}`)
			];
		
			const chatRequest = await chatModel[0].sendRequest(messages, undefined, token);
			for await (const message of chatRequest.text) {
				response.markdown(message);
			}

			
		}else if (request.command === 'transform') {
            let promptFilePath =  '../src/prompts/dependencies.md';
            let pathToPrompt = path.resolve(__dirname, promptFilePath);

			//dependencies
			const prompt = fs.readFileSync(pathToPrompt, 'utf-8');

            promptFilePath =  '../src/prompts/features.md';
            pathToPrompt = path.resolve(__dirname, promptFilePath);

			//functionality
			const prompt2 = fs.readFileSync(pathToPrompt, 'utf-8');

            promptFilePath =  '../src/prompts/transform.md';
            pathToPrompt = path.resolve(__dirname, promptFilePath);
			// transform
			const prompt3 = fs.readFileSync(pathToPrompt, 'utf-8');

            let documentText = '';
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                let document = editor.document;
                // Get the document text
                documentText = document.getText();
            }

			const messages = [vscode.LanguageModelChatMessage.User(prompt + "\n" + prompt2 + "\n" + prompt3),
							vscode.LanguageModelChatMessage.User(`${query} ${documentText}`)];
			
			const chatRequest = await chatModel[0].sendRequest(messages, undefined, token);
			for await (const message of chatRequest.text) {
				response.markdown(message);
			}

		}

	});


    // Chat participants appear as top-level options in the chat input
    // when you type `@`, and can contribute sub-commands in the chat input
    // that appear when you type `/`.
    const codearcheo = vscode.chat.createChatParticipant(CODEARCHEO_PARTICIPANT_ID, handler);
    codearcheo.iconPath = vscode.Uri.joinPath(context.extensionUri, 'codearcheo.jpeg');
    codearcheo.followupProvider = {
        provideFollowups(result: ICodearcheoChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
            return [{
                prompt: 'Dig for logic and structure',
                label: vscode.l10n.t('Let us dig deeper into the code'),
                command: 'dig'
            } satisfies vscode.ChatFollowup];
        }
    };

    const logger = vscode.env.createTelemetryLogger({
        sendEventData(eventName, data) {
            // Capture event telemetry
            console.log(`Event: ${eventName}`);
            console.log(`Data: ${JSON.stringify(data)}`);
        },
        sendErrorData(error, data) {
            // Capture error telemetry
            console.error(`Error: ${error}`);
            console.error(`Data: ${JSON.stringify(data)}`);
        }
    });

    context.subscriptions.push(codearcheo.onDidReceiveFeedback((feedback: vscode.ChatResultFeedback) => {
        // Log chat result feedback to be able to compute the success matric of the participant
        // unhelpful / totalRequests is a good success metric
        logger.logUsage('chatResultFeedback', {
            kind: feedback.kind
        });
    }));

    context.subscriptions.push(
        codearcheo,
        // Register the command handler for the /meow followup
        vscode.commands.registerTextEditorCommand(CODEARCHEO_NAMES_COMMAND_ID, async (textEditor: vscode.TextEditor) => {
            // Replace all variables in active editor with cat names and words
            const text = textEditor.document.getText();

            let chatResponse: vscode.LanguageModelChatResponse | undefined;
            try {
                const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
                if (!model) {
                    console.log('Model not found. Please make sure the GitHub Copilot Chat extension is installed and enabled.');
                    return;
                }

                const messages = [
                    vscode.LanguageModelChatMessage.User(`You are a cat! Think carefully and step by step like a cat would.
                    Your job is to replace all variable names in the following code with funny cat variable names. Be creative. IMPORTANT respond just with code. Do not use markdown!`),
                    vscode.LanguageModelChatMessage.User(text)
                ];
                chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);

            } catch (err) {
                if (err instanceof vscode.LanguageModelError) {
                    console.log(err.message, err.code, err.cause);
                } else {
                    throw err;
                }
                return;
            }

            // Clear the editor content before inserting new content
            await textEditor.edit(edit => {
                const start = new vscode.Position(0, 0);
                const end = new vscode.Position(textEditor.document.lineCount - 1, textEditor.document.lineAt(textEditor.document.lineCount - 1).text.length);
                edit.delete(new vscode.Range(start, end));
            });

            // Stream the code into the editor as it is coming in from the Language Model
            try {
                for await (const fragment of chatResponse.text) {
                    await textEditor.edit(edit => {
                        const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
                        const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
                        edit.insert(position, fragment);
                    });
                }
            } catch (err) {
                // async response stream may fail, e.g network interruption or server side error
                await textEditor.edit(edit => {
                    const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
                    const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
                    edit.insert(position, (<Error>err).message);
                });
            }
        }),
        vscode.commands.registerTextEditorCommand(CODEARCHEO_AST_COMMAND_ID, async (textEditor: vscode.TextEditor) => {
            // Replace all variables in active editor with cat names and words
            const text = textEditor.document.getText();

            await vscode.commands.executeCommand('codeQL.viewAst', textEditor.document.uri);

        }),
    );
}

async function processCommandRequest(ctor: PromptElementCtor<PromptElementProps<PromptProps>, any>, request: vscode.ChatRequest, token: vscode.CancellationToken, stream: vscode.ChatResponseStream, logger: vscode.TelemetryLogger) {
    try {
        const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
        if (model) {
            // Here's an example of how to use the prompt-tsx library to build a prompt
            const { messages } = await renderPrompt(
                ctor,
                { userQuery: request.prompt },
                { modelMaxPromptTokens: model.maxInputTokens },
                model);

            const chatResponse = await model.sendRequest(messages, {}, token);
            for await (const fragment of chatResponse.text) {
                stream.markdown(fragment);
            }
        }
    } catch (err) {
        handleError(logger, err, stream);
    }
}

function handleError(logger: vscode.TelemetryLogger, err: any, stream: vscode.ChatResponseStream): void {
    // making the chat request might fail because
    // - model does not exist
    // - user consent not given
    // - quote limits exceeded
    logger.logError(err);
    
    if (err instanceof vscode.LanguageModelError) {
        console.log(err.message, err.code, err.cause);
        if (err.cause instanceof Error && err.cause.message.includes('off_topic')) {
            stream.markdown(vscode.l10n.t('I\'m sorry, I can only explain computer science concepts.'));
        }
    } else {
        // re-throw other errors so they show up in the UI
        throw err;
    }
}

// Get a random topic that the cat has not taught in the chat history yet
function getTopic(history: ReadonlyArray<vscode.ChatRequestTurn | vscode.ChatResponseTurn>): string {
    const topics = ['linked list', 'recursion', 'stack', 'queue', 'pointers'];
    // Filter the chat history to get only the responses from the cat
    const previousCodearcheoResponses = history.filter(h => {
        return h instanceof vscode.ChatResponseTurn && h.participant === CODEARCHEO_PARTICIPANT_ID;
    }) as vscode.ChatResponseTurn[];
    // Filter the topics to get only the topics that have not been taught by the cat yet
    const topicsNoRepetition = topics.filter(topic => {
        return !previousCodearcheoResponses.some(codearcheoResponse => {
            return codearcheoResponse.response.some(r => {
                return r instanceof vscode.ChatResponseMarkdownPart && r.value.value.includes(topic);
            });
        });
    });

    return topicsNoRepetition[Math.floor(Math.random() * topicsNoRepetition.length)] || 'I have taught you everything I know. Meow!';
}

function extractSrcFiles(makefilePath: string): string[] {
    const content = fs.readFileSync(makefilePath, 'utf-8');
    const srcMatch = content.match(/SRC\s*=\s*([\s\S]*?)(?=\n\S|$)/);
    
    if (srcMatch) {
        const srcFiles = srcMatch[1]
            .split(/\\?\s+/)
            .map(file => path.resolve(path.dirname(makefilePath), file.trim()))
            .filter(file => file.length > 0);
        return srcFiles.splice(0, srcFiles.length-1);
    } else {
        return [];
    }
}

export function deactivate() { }