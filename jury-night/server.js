// Jury Night server: serves the screens and keeps every phone in sync over the home Wi-Fi.
// Start with: node server.js            (dummy case)
//         or: CASE=private/my-case.js node server.js
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const QRCode = require("qrcode");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const CASE_FILE = path.join(ROOT, "cases", process.env.CASE || "dummy.js");
const STATE_FILE = path.join(ROOT, "state.json");

if (!fs.existsSync(CASE_FILE)) {
  console.error(`Case file not found: ${CASE_FILE}`);
  process.exit(1);
}

// Load the case on the server too, so it can check roles and line counts.
const loadCase = () => {
  const sandbox = { window: {} };
  new Function("window", fs.readFileSync(CASE_FILE, "utf8"))(sandbox.window);
  return sandbox.window.CASE;
};
const CASE = loadCase();
const ROLE_IDS = new Set(CASE.roles.map(r => r.id));
const LAST = CASE.lines.length - 1;

// ---- state (saved to disk so a restart resumes on the same line) ----
let S = { v: 1, line: -1, roles: {}, caseTitle: CASE.title };
try {
  const saved = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  if (saved.caseTitle === CASE.title) S = saved;
} catch (e) {}
const save = () => fs.writeFile(STATE_FILE, JSON.stringify(S), () => {});

// ---- live connections (Server-Sent Events) ----
const clients = new Set();
const broadcast = () => {
  const msg = `data: ${JSON.stringify(S)}\n\n`;
  for (const res of clients) res.write(msg);
};
setInterval(() => { for (const res of clients) res.write(": ping\n\n"); }, 15000);

const apply = a => {
  const roleOf = c => Object.keys(S.roles).find(r => S.roles[r] === c);
  switch (a.type) {
    case "claim":
      if (!ROLE_IDS.has(a.role) || S.roles[a.role]) return false;
      for (const r in S.roles) if (S.roles[r] === a.client) delete S.roles[r];
      S.roles[a.role] = a.client;
      return true;
    case "leave": {
      const r = roleOf(a.client);
      if (!r) return false;
      delete S.roles[r];
      return true;
    }
    case "free":
      if (!S.roles[a.role]) return false;
      delete S.roles[a.role];
      return true;
    case "step": {
      const next = Math.max(-1, Math.min(LAST, S.line + (a.d > 0 ? 1 : -1)));
      if (next === S.line) return false;
      S.line = next;
      return true;
    }
    case "done": // only the current speaker can move the trial on
      if (S.line < 0 || S.line >= LAST) return false;
      if (CASE.lines[S.line].who !== roleOf(a.client)) return false;
      S.line += 1;
      return true;
    case "reset":
      S.line = -1; S.roles = {};
      return true;
  }
  return false;
};

// ---- network address for the QR code ----
const lanIP = () => {
  const nets = os.networkInterfaces();
  const order = ["en0", "en1", ...Object.keys(nets)];
  for (const name of order) {
    for (const n of nets[name] || []) if (n.family === "IPv4" && !n.internal) return n.address;
  }
  return "localhost";
};
const joinURL = () => `http://${lanIP()}:${PORT}/#phone`;

const send = (res, code, type, body) => {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
};

http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  if (url === "/events") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
    res.write(`data: ${JSON.stringify(S)}\n\n`);
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  if (url === "/action" && req.method === "POST") {
    let body = "";
    req.on("data", c => { body += c; if (body.length > 1e4) req.destroy(); });
    req.on("end", () => {
      let a;
      try { a = JSON.parse(body); } catch (e) { return send(res, 400, "text/plain", "bad json"); }
      if (apply(a)) { S.v += 1; save(); broadcast(); }
      send(res, 200, "application/json", JSON.stringify({ ok: true, v: S.v }));
    });
    return;
  }

  if (url === "/case.js") return send(res, 200, "application/javascript", fs.readFileSync(CASE_FILE));
  if (url === "/info") return send(res, 200, "application/json", JSON.stringify({ joinURL: joinURL() }));
  if (url === "/qr.svg") {
    QRCode.toString(joinURL(), { type: "svg", margin: 1, color: { dark: "#0d0f11", light: "#ffffff" } })
      .then(svg => send(res, 200, "image/svg+xml", svg))
      .catch(() => send(res, 500, "text/plain", "qr failed"));
    return;
  }
  if (url === "/" || url === "/index.html") {
    return send(res, 200, "text/html; charset=utf-8", fs.readFileSync(path.join(ROOT, "public", "index.html")));
  }
  send(res, 404, "text/plain", "not found");
}).listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("  Jury Night is running");
  console.log(`  Case:   ${CASE.title}`);
  console.log(`  TV:     http://localhost:${PORT}/#tv`);
  console.log(`  Phones: ${joinURL()}`);
  console.log("  Leave this window open. Close it to stop.");
  console.log("");
});
