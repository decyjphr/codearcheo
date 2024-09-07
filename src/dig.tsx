import {
	BasePromptElementProps,
	PromptElement,
	PromptSizing,
	UserMessage
} from '@vscode/prompt-tsx';
import * as vscode from 'vscode';

const digPrompt = `Analyze this code 
Use the instructions given below and delimited by <<<
<<<
1. Read steps 1 to 4 and then proceed to generate the response 
2. Identify all the symbols for classes, interfaces, attributes, function arguments , return values, variables
3. Convert them to natural language words
4. Create a mermaid markdown that shows the entities and relationships
<<<
`;

export interface PromptProps extends BasePromptElementProps {
	userQuery: string;
}

export class DigPrompt extends PromptElement<PromptProps, void> {
	render(state: void, sizing: PromptSizing) {
		// Get the active text editor
		let documentText = '';
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let document = editor.document;
			// Get the document text
			documentText = document.getText();
		}
		return (
			<>
				<UserMessage>
					${digPrompt}${documentText}
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}