// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext } from 'vscode';
import { runXSLTTransformation } from './xslt/xsltTransform';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	context.subscriptions.push(commands.registerCommand("xslt.transform", async () => {
        await runXSLTTransformation();
    }));
}

// this method is called when your extension is deactivated
export function deactivate() { }
