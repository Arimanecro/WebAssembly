import fs from "node:fs";
import http from "node:http";

let html = fs.readFileSync("./index.html");
const source = fs.readFileSync("./fib.wasm");
const typedArray = new Uint8Array(source);

const server = http.createServer(async (req, res) => {
  if (req.url == "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(html);
  } else if (req.url == "/wasm") {
    res.writeHead(200, { "Content-type": "application/wasm" });
    res.end(typedArray);
  }
});

server.listen(8000, () =>
  console.log("\x1b[36m%s\x1b[0m", "Server was started!")
);
