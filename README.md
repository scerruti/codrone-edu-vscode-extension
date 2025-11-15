# CoDrone EDU Control Panel - VS Code Extension

A VS Code extension for monitoring and controlling CoDrone EDU drones with safety overrides.

## Features

- **Connection Management**: Connect to local or remote drone backend
- **Real-time Sensor Monitoring**: Battery, altitude, temperature, roll
- **Emergency Controls**: 
  - Emergency Land - Graceful landing
  - Emergency Stop - Immediate stop
- **Mock UI**: Test interface without real drone connection
- **Cross-Platform**: Works on macOS, Windows, Linux
- **Codespaces Ready**: Works in GitHub Codespaces with SSH tunnel backend

## Phase 1: Mock UI Prototype (Current)

This is the initial mock UI prototype with simulated sensor data. It demonstrates:
- VS Code WebView integration
- Theme-aware UI (light/dark mode)
- Safety-critical button design
- Message passing architecture

## Next Phases

- **Phase 2**: Java WebSocket backend integration
- **Phase 3**: Real sensor data streaming
- **Phase 4**: Codespaces deployment

## Development

```bash
npm install
npm run compile
npm run watch
```

Press F5 to debug the extension in VS Code.

## Architecture

See [../../VSCODE_EXTENSION_RESEARCH.md](../../VSCODE_EXTENSION_RESEARCH.md) for detailed architecture documentation.

## Related Repository

Main CoDrone EDU library: https://github.com/scerruti/JCoDroneEdu

## License

MIT
