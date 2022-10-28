import * as vscode from 'vscode';
import { BimwinCompletionItemProvider, BimwinHoverProvider } from './app';

export function activate(context: vscode.ExtensionContext) {
	let completionItemProvider = new BimwinCompletionItemProvider();
	let completionHoverProvider = new BimwinHoverProvider();


	let completion = vscode.languages.registerCompletionItemProvider([{
		language: 'vue', scheme: 'file'
	}], completionItemProvider, '', ' ', '.', ':', '<', '"', "'", '/', '@', '(');

	let completionHover = vscode.languages.registerHoverProvider([{
		language: 'vue', scheme: 'file'
	}], completionHoverProvider);

	context.subscriptions.push(completion, completionHover)

	console.log('============================================start===========================================')
}

// this method is called when your extension is deactivated
export function deactivate() { }
