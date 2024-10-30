"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function extractSrcFiles(makefilePath) {
    const content = fs.readFileSync(makefilePath, 'utf-8');
    const srcMatch = content.match(/SRC\s*=\s*([\s\S]*?)(?=\n\S|$)/);
    if (srcMatch) {
        const srcFiles = srcMatch[1]
            .split(/\\?\s+/)
            .map(file => path.resolve(path.dirname(makefilePath), file.trim()))
            .filter(file => file.length > 0);
        return srcFiles.splice(0, srcFiles.length - 1);
    }
    else {
        return [];
    }
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    vscode.chat.createChatParticipant("legacynavigator.demo", async (request, context, response, token) => {
        const query = request.prompt;
        const chatModel = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
        if (request.command === 'demystify') {
            const prompt = fs.readFileSync("C:\\Users\\sclachar\\Scripts\\GitHub Universe\\legacynavigator\\src\\prompts\\explain.md", 'utf-8');
            const messages = [vscode.LanguageModelChatMessage.User(prompt),
                vscode.LanguageModelChatMessage.User(query)];
            const chatRequest = await chatModel[0].sendRequest(messages, undefined, token);
            for await (const message of chatRequest.text) {
                response.markdown(message);
            }
        }
        else if (request.command === 'structure') {
            const srcFiles = extractSrcFiles("C:\\Users\\sclachar\\Scripts\\GitHub Universe\\legacynavigator\\legacy-mars-global-climate-model-main\\code\\Makefile");
            const prompt = fs.readFileSync("C:\\Users\\sclachar\\Scripts\\GitHub Universe\\legacynavigator\\src\\prompts\\graph.md", 'utf-8');
            // prompt = `Analyze the following file contents and determine how each file is linked to the others:\n${prompt}`;
            const messages = [
                vscode.LanguageModelChatMessage.User(prompt + "\n" + `The following files are used in this repository:\n${srcFiles.join('\n')}` + "\n" + "You should suggest a mermaid diagram that begins with ```mermaid and ends with ```" + "\n"),
                vscode.LanguageModelChatMessage.User(query)
            ];
            const chatRequest = await chatModel[0].sendRequest(messages, undefined, token);
            for await (const message of chatRequest.text) {
                response.markdown(message);
            }
        }
        else if (request.command === 'transform') {
            //dependencies
            const prompt = fs.readFileSync("C:\\Users\\sclachar\\Scripts\\GitHub Universe\\legacynavigator\\src\\prompts\\dependencies.md", 'utf-8');
            //functionality
            const prompt2 = fs.readFileSync("C:\\Users\\sclachar\\Scripts\\GitHub Universe\\legacynavigator\\src\\prompts\\features.md", 'utf-8');
            // transform
            const prompt3 = fs.readFileSync("C:\\Users\\sclachar\\Scripts\\GitHub Universe\\legacynavigator\\src\\prompts\\transform.md", 'utf-8');
            const messages = [vscode.LanguageModelChatMessage.User(prompt + "\n" + prompt2 + "\n" + prompt3),
                vscode.LanguageModelChatMessage.User(query)];
            const chatRequest = await chatModel[0].sendRequest(messages, undefined, token);
            for await (const message of chatRequest.text) {
                response.markdown(message);
            }
        }
    });
    // create a smart action to explain the code in any folder in the file explorer
    // // Use the console to output diagnostic information (console.log) and errors (console.error)
    // // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "legacynavigator" is now active!');
    // // The command has been defined in the package.json file
    // // Now provide the implementation of the command with registerCommand
    // // The commandId parameter must match the command field in package.json
    // const disposable = vscode.commands.registerCommand('legacynavigator.helloWorld', () => {
    // 	// The code you place here will be executed every time your command is executed
    // 	// Display a message box to the user
    // 	vscode.window.showInformationMessage('Hello World from LegacyNavigator!');
    // });
    // context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension-sc.js.map