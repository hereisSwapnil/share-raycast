import React, { useState } from "react";
import { Form, ActionPanel, Action, showToast, Toast, environment, useNavigation, Detail } from "@raycast/api";

import { spawn } from "child_process";
import path from "path";
import QRCode from "qrcode";
import mime from "mime-types";

interface FormValues {
  files: string[];
}

function QRCodeView({ url, fileName }: { url: string; fileName: string }) {
  const [qrCodeDataUri, setQrCodeDataUri] = useState<string | null>(null);

  useState(() => {
    // Generate a slightly smaller QR code and remove the large white margin
    QRCode.toDataURL(url, { width: 300, margin: 1 }).then(setQrCodeDataUri).catch(console.error);
  });

  if (!qrCodeDataUri) {
    return <Detail markdown="Generating QR Code..." />;
  }

  const markdown = `
*Scan this QR code with your mobile device to start the download automatically.*

<img src="${qrCodeDataUri}" width="290" height="290" />
  `;

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="File Name" text={fileName} />
          <Detail.Metadata.Link title="Download URL" target={url} text={url} />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy URL" content={url} />
        </ActionPanel>
      }
    />
  );
}

export default function Command() {
  const { push } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: FormValues) {
    if (!values.files || values.files.length === 0) {
      showToast({ style: Toast.Style.Failure, title: "No file selected" });
      return;
    }

    const filePath = values.files[0];
    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    const serverScript = path.join(environment.assetsPath, "server.js");

    setIsLoading(true);

    try {
      const child = spawn(process.execPath, [serverScript, filePath, mimeType], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      child.unref();

      if (child.stdout) {
        child.stdout.on('data', (data) => {
          try {
            const result = JSON.parse(data.toString());
            if (result.port && result.ip) {
              const url = `http://${result.ip}:${result.port}`;
              const fileName = path.basename(filePath);
              setIsLoading(false);
              push(<QRCodeView url={url} fileName={fileName} />);
            }
          } catch (e) {
            // Ignore non-json output
          }
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data) => {
          console.error("Server error:", data.toString());
        });
      }
    } catch (error) {
      setIsLoading(false);
      showToast({ style: Toast.Style.Failure, title: "Failed to start server", message: String(error) });
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Share File" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="files"
        title="Select File"
        allowMultipleSelection={false}
        canChooseDirectories={false}
      />
    </Form>
  );
}
