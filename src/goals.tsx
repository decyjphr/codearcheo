import {
	BasePromptElementProps,
	PromptElement,
	PromptSizing,
	UserMessage
} from '@vscode/prompt-tsx';
import * as vscode from 'vscode';

const goalsPrompt = `
@github What are the goals, objectives, and techincal requirements of this project. Provide the output in a table of objectives and how it is implemented. Also provide additional key aspects of this repository that are not covered in the objectives.
`;

export interface PromptProps extends BasePromptElementProps {
	userQuery: string;
}

export class GoalsPrompt extends PromptElement<PromptProps, void> {
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
					${goalsPrompt}${documentText}
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}