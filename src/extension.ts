import * as vscode from 'vscode';
import { BimwinCompletionItemProvider } from './app';

export function activate(context: vscode.ExtensionContext) {
	let completionItemProvider = new BimwinCompletionItemProvider();


	let completion = vscode.languages.registerCompletionItemProvider([{
		language: 'vue', scheme: 'file'
	}], completionItemProvider, '', ' ', ':', '<', '"', "'", '/', '@', '(');

	context.subscriptions.push(completion)

	console.log('============================================start===========================================')
}

// this method is called when your extension is deactivated
export function deactivate() { }
