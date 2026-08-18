const http = require("http");
const crypto = require("crypto");

const WS_PORT = Number(process.env.WS_PORT || 3189);
const RENDER_HTTP = process.env.RENDER_HTTP || "http://127.0.0.1:7832";
const AUTH = process.env.RENDER_KEY || "";

function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body));
    const url = new URL(path, RENDER_HTTP);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          try {
            resolve({ status: res.statusCode, json: JSON.parse(raw) });
          } catch (e) {
            reject(new Error("renderer not json: " + raw.slice(0, 200)));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function wsAccept(key) {
  return crypto
    .createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64");
}

function decodeFrame(buf) {
  if (buf.length < 2) return null;
  const opcode = buf[0] & 15;
  const masked = (buf[1] & 128) !== 0;
  let len = buf[1] & 127;
  let off = 2;
  if (len === 126) {
    if (buf.length < 4) return null;
    len = buf.readUInt16BE(2);
    off = 4;
  } else if (len === 127) {
    return null;
  }
  let mask;
  if (masked) {
    if (buf.length < off + 4) return null;
    mask = buf.slice(off, off + 4);
    off += 4;
  }
  if (buf.length < off + len) return null;
  const payload = buf.slice(off, off + len);
  if (masked) {
    for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4];
  }
  return { opcode, payload: payload.toString("utf8"), rest: buf.slice(off + len) };
}

function encodeText(text) {
  const payload = Buffer.from(text, "utf8");
  let header;
  if (payload.length < 126) {
    header = Buffer.from([0x81, payload.length]);
  } else {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
  }
  return Buffer.concat([header, payload]);
}

async function handleCommand(msg) {
  const userId = msg.args && msg.args[0] && msg.args[0].userId;
  const cmd = msg.command;
  let path = null;
  if (cmd === "GenerateThumbnailHeadshot") path = "/player/headshot";
  else if (cmd === "GenerateThumbnail") path = "/player/thumbnail";
  else if (cmd === "GenerateThumbnailAsset") path = "/catalog/hat";
  else if (cmd === "GenerateThumbnailTeeShirt") path = "/image/teeshirt";
  else if (cmd === "GenerateThumbnailGame") path = "/game/thumbnail";
  if (!path) {
    return { id: msg.id, status: 400, data: null };
  }
  const body = userId != null ? { userId } : msg.args && msg.args[0] ? msg.args[0] : {};
  if (msg.args && msg.args[0] && typeof msg.args[0] === "number") {
    body.assetId = msg.args[0];
    body.userId = undefined;
  }
  const result = await postJson(path, body.userId != null ? { userId: body.userId } : body);
  const data = result.json && (result.json.data || result.json.thumbnail || result.json.image);
  return {
    id: msg.id,
    status: result.json && result.json.success === false ? 500 : 200,
    data: data || null,
  };
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("render-ws-bridge");
});

server.on("upgrade", (req, socket) => {
  const url = new URL(req.url, "http://localhost");
  if (AUTH && url.searchParams.get("key") !== AUTH) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }
  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
  }
  const accept = wsAccept(key);
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " +
      accept +
      "\r\n\r\n"
  );
  let buf = Buffer.alloc(0);
  socket.on("data", async (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    while (true) {
      const frame = decodeFrame(buf);
      if (!frame) break;
      buf = frame.rest;
      if (frame.opcode === 8) {
        socket.end();
        return;
      }
      if (frame.opcode !== 1) continue;
      let msg;
      try {
        msg = JSON.parse(frame.payload);
      } catch (e) {
        continue;
      }
      try {
        const reply = await handleCommand(msg);
        socket.write(encodeText(JSON.stringify(reply)));
      } catch (e) {
        socket.write(
          encodeText(
            JSON.stringify({
              id: msg.id,
              status: 500,
              data: null,
            })
          )
        );
        console.error(e.message || e);
      }
    }
  });
});

server.listen(WS_PORT, "0.0.0.0", () => {
  console.log("render-ws-bridge ws://" + "127.0.0.1:" + WS_PORT + " -> " + RENDER_HTTP);
});
