import * as vscode from 'vscode';
import commands from './commands'
import {upload,callApi} from './api'
import {uploadSnippet} from './Globals'
// * Status Bar Buttons 
let addSnippetButton: vscode.StatusBarItem;
let quickSearchButton: vscode.StatusBarItem;

// * Basically main function
export function activate(context: vscode.ExtensionContext) {
	const { subscriptions }: vscode.ExtensionContext = context;
	subscriptions.push(vscode.commands.registerCommand(commands.ADD, () => {
		const title = vscode.window.createInputBox();
		title.placeholder = 'Enter Title';
		title.show();
		title.onDidAccept(async () => {
			title.hide();
			const editor = vscode.window.activeTextEditor;
			if (!editor) return;
			const text = editor.document.getText(editor.selection);
			const uploadSnippet :uploadSnippet = {answer: text, search: title.value};
            upload(uploadSnippet)
		})
	}));

	// * Register Status Bar Buttons
	quickSearchButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	quickSearchButton.text = 'Search $(search)'
	quickSearchButton.command = commands.SEARCH
	quickSearchButton.show();

	addSnippetButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	addSnippetButton.text = `QS $(add)`
	addSnippetButton.command = commands.ADD;
	addSnippetButton.show();

	console.log('Congratulations, your extension "quicksearch" is now active!');

	let disposable = vscode.commands.registerCommand(commands.SEARCH, async () => {
		vscode.window.showInformationMessage('Welcome to Quick Search');
		const editor = vscode.window.activeTextEditor;
		if (!editor)
			return vscode.window.showInformationMessage('Need to be in editor');

		const input = vscode.window.createInputBox();
		input.placeholder = 'Quick Search'
		input.show();
		input.onDidAccept(async () => {
			input.hide();
			await callApi(input.value, editor);
		})
	});
	
	context.subscriptions.push(disposable);
}

export function deactivate() { }
