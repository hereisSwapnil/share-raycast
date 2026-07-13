# Share Raycast Extension

A sleek and native Raycast extension that allows you to instantly share any file from your Mac over your local network. It dynamically generates a QR code within Raycast so you can simply scan it with your mobile device (like an Android phone) to download the file automatically!

## Features

- **Instant Local Hosting:** Select a file and a local HTTP server is instantly spun up in the background.
- **Smart IP & Port Detection:** Automatically detects your local network interface (IPv4) and assigns an available port.
- **Auto-Download:** Uses HTTP headers to ensure the file is downloaded to your mobile device automatically upon scanning.
- **Native UI:** Clean, polished Raycast interface featuring a constrained QR code and a beautiful metadata side pane.
- **Auto-Shutdown:** The background server automatically closes after 2 minutes of being spawned, preventing any port leaks or security issues.

## How to use

1. Run the **Share File** command in Raycast.
2. Select any file or document from your Mac using the file picker.
3. Press **Enter** to submit.
4. Scan the QR code displayed in Raycast with your mobile device.
5. The file will download automatically!

## Installation

Since this extension is not yet published to the Raycast store, you can install it locally:

1. Clone this repository.
2. Run \`npm install\` to install dependencies.
3. Run \`npm run build\` to build the extension, or \`npm run dev\` to test it.
4. Use Raycast's "Import Extension" command to add it to your local extensions.
