const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const filePath = process.argv[2];
const providedMime = process.argv[3];

if (!filePath || !fs.existsSync(filePath)) {
  console.error("Invalid file path provided.");
  process.exit(1);
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

const fileName = path.basename(filePath);
const mimeType = providedMime || "application/octet-stream";

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": mimeType,
    "Content-Disposition": `attachment; filename="${fileName}"`,
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
  
  readStream.on("end", () => {
    // Optionally close after a successful download
    // setTimeout(() => process.exit(0), 1000);
  });
});

server.listen(0, () => {
  const port = server.address().port;
  const ip = getLocalIp();
  console.log(JSON.stringify({ port, ip }));
});

// Auto-close after 2 minutes
setTimeout(() => {
  server.close(() => {
    process.exit(0);
  });
}, 2 * 60 * 1000);
