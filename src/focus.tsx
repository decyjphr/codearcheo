import {
	BasePromptElementProps,
	PromptElement,
	PromptSizing,
	UserMessage
} from '@vscode/prompt-tsx';
import * as vscode from 'vscode';

const focusPrompt = `What is the purpose of and logic in this code. How does the logic flow when the program is invoked?

`;

export interface PromptProps extends BasePromptElementProps {
	userQuery: string;
}

export class FocusPrompt extends PromptElement<PromptProps, void> {
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
					${focusPrompt}${documentText}
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}