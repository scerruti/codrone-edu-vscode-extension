import * as vscode from 'vscode';

export class ControlPanelProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'coDronePanel';

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'connect': {
					vscode.window.showInformationMessage(`Connecting to drone at ${data.value}`);
					break;
				}
				case 'emergency_land': {
					vscode.window.showWarningMessage('EMERGENCY LAND - Sending command to drone');
					break;
				}
				case 'emergency_stop': {
					vscode.window.showWarningMessage('EMERGENCY STOP - Sending command to drone');
					break;
				}
			}
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>CoDrone EDU Control Panel</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: var(--vscode-font-family);
			color: var(--vscode-foreground);
			background-color: var(--vscode-editor-background);
			padding: 16px;
		}
		.container {
			max-width: 400px;
			margin: 0 auto;
		}
		h1 {
			font-size: 18px;
			margin-bottom: 16px;
			padding-bottom: 8px;
			border-bottom: 1px solid var(--vscode-textBlockQuote-border);
		}
		.section {
			margin-bottom: 20px;
			padding: 12px;
			background-color: var(--vscode-sideBar-background);
			border-radius: 4px;
		}
		.section h2 {
			font-size: 14px;
			margin-bottom: 10px;
			color: var(--vscode-textLink-foreground);
		}
		.connection-form {
			display: flex;
			gap: 8px;
			margin-bottom: 10px;
		}
		input {
			flex: 1;
			padding: 6px 8px;
			background-color: var(--vscode-input-background);
			color: var(--vscode-input-foreground);
			border: 1px solid var(--vscode-input-border);
			border-radius: 2px;
		}
		button {
			padding: 6px 12px;
			background-color: var(--vscode-button-background);
			color: var(--vscode-button-foreground);
			border: none;
			border-radius: 2px;
			cursor: pointer;
			font-size: 12px;
			transition: background-color 0.2s;
		}
		button:hover {
			background-color: var(--vscode-button-hoverBackground);
		}
		button.emergency {
			background-color: #d91e1e;
			margin: 4px 0;
			width: 100%;
		}
		button.emergency:hover {
			background-color: #f41717;
		}
		.sensor-display {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 10px;
		}
		.sensor-item {
			padding: 8px;
			background-color: var(--vscode-editor-background);
			border: 1px solid var(--vscode-textBlockQuote-border);
			border-radius: 2px;
		}
		.sensor-label {
			font-size: 11px;
			color: var(--vscode-descriptionForeground);
			margin-bottom: 4px;
		}
		.sensor-value {
			font-size: 18px;
			font-weight: bold;
			color: var(--vscode-textLink-foreground);
		}
		.status {
			padding: 8px;
			border-radius: 2px;
			margin-bottom: 10px;
		}
		.status.connected {
			background-color: rgba(34, 139, 34, 0.2);
			color: #22d4a4;
		}
		.status.disconnected {
			background-color: rgba(220, 53, 69, 0.2);
			color: #f48771;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>🚁 CoDrone EDU Control Panel</h1>
		
		<div class="section">
			<h2>Connection</h2>
			<div class="status disconnected" id="connectionStatus">
				● Disconnected
			</div>
			<div class="connection-form">
				<input type="text" id="droneAddress" placeholder="localhost:8000" value="localhost:8000">
				<button onclick="connect()">Connect</button>
			</div>
		</div>

		<div class="section">
			<h2>Sensor Data</h2>
			<div class="sensor-display">
				<div class="sensor-item">
					<div class="sensor-label">Battery</div>
					<div class="sensor-value" id="battery">--</div>
					<div class="sensor-label">%</div>
				</div>
				<div class="sensor-item">
					<div class="sensor-label">Altitude</div>
					<div class="sensor-value" id="altitude">--</div>
					<div class="sensor-label">cm</div>
				</div>
				<div class="sensor-item">
					<div class="sensor-label">Temperature</div>
					<div class="sensor-value" id="temperature">--</div>
					<div class="sensor-label">°C</div>
				</div>
				<div class="sensor-item">
					<div class="sensor-label">Roll</div>
					<div class="sensor-value" id="roll">--</div>
					<div class="sensor-label">°</div>
				</div>
			</div>
		</div>

		<div class="section">
			<h2>Safety Overrides</h2>
			<button class="emergency" onclick="emergencyLand()">�� Emergency Land</button>
			<button class="emergency" onclick="emergencyStop()">⛔ Emergency Stop</button>
		</div>

		<div class="section">
			<h2>Mock Data</h2>
			<p style="font-size: 11px; color: var(--vscode-descriptionForeground); margin-bottom: 10px;">
				Displaying simulated sensor values for development/testing
			</p>
		</div>
	</div>

	<script>
		const vscode = acquireVsCodeApi();

		function connect() {
			const address = document.getElementById('droneAddress').value;
			vscode.postMessage({ type: 'connect', value: address });
			
			// Mock connected state
			const status = document.getElementById('connectionStatus');
			status.className = 'status connected';
			status.innerHTML = '● Connected';
			
			// Simulate sensor data
			simulateSensorData();
		}

		function emergencyLand() {
			vscode.postMessage({ type: 'emergency_land' });
			flashButton(event.target);
		}

		function emergencyStop() {
			vscode.postMessage({ type: 'emergency_stop' });
			flashButton(event.target);
		}

		function flashButton(button) {
			button.style.opacity = '0.5';
			setTimeout(() => { button.style.opacity = '1'; }, 100);
			setTimeout(() => { button.style.opacity = '0.5'; }, 200);
			setTimeout(() => { button.style.opacity = '1'; }, 300);
		}

		function simulateSensorData() {
			setInterval(() => {
				document.getElementById('battery').textContent = Math.floor(Math.random() * 100);
				document.getElementById('altitude').textContent = Math.floor(Math.random() * 200);
				document.getElementById('temperature').textContent = (20 + Math.random() * 10).toFixed(1);
				document.getElementById('roll').textContent = (Math.random() * 360).toFixed(0);
			}, 1000);
		}
	</script>
</body>
</html>`;
	}
}
