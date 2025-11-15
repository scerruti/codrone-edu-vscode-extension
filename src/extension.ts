import * as vscode from 'vscode';
import { ControlPanelProvider } from './controlPanelProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('CoDrone EDU Control Panel extension activated');

	const provider = new ControlPanelProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'coDronePanel',
			provider,
			{
				webviewOptions: {
					retainContextWhenHidden: true
				}
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('codrone.openPanel', () => {
			vscode.commands.executeCommand('coDronePanel.focus');
		})
	);
}

export function deactivate() {
	console.log('CoDrone EDU Control Panel extension deactivated');
}
