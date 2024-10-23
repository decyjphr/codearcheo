import {
	BasePromptElementProps,
	PromptElement,
	PromptSizing,
	UserMessage
} from '@vscode/prompt-tsx';
import * as vscode from 'vscode';

const triggersPrompt = `
@github What user actions, commands, events will trigger the simulation of the martian climate functionality
`;

export interface PromptProps extends BasePromptElementProps {
	userQuery: string;
}

export class TriggersPrompt extends PromptElement<PromptProps, void> {
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
					${triggersPrompt}${documentText}
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}