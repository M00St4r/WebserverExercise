// Import aus Deno SQLite Modul
import { Database } from "jsr:@db/sqlite";
// Dateien für Frontend hosten
import { serveDir } from "jsr:@std/http/file-server";

// --- später aktivieren ---
// import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const hostname = "127.0.0.1"; // localhost
const port = 3000;

// --- Datenbank vorbereiten ---
const db = new Database("users.db");
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    games INTEGER,
    wins INTEGER
  )
`).run();

Deno.serve({ hostname, port }, async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  let status = 200;
  let body: unknown = "";
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (url.pathname === "/guess" && request.method === "POST") {
    const { guess, id } = await request.json();

    let result: boolean = false;
    const rand: number = Math.floor(Math.random() * 10);

    const playerHistory = db.prepare("SELECT games, wins FROM users WHERE id = ?");
    const playerData = playerHistory.all(id)[0];

    if (JSON.parse(guess) == rand) {
      result = true;
      playerData.wins++;
    } else {
      result = false;
    }

    playerData.games++;
    //update db valuse
    const stmt = db.prepare("UPDATE users SET games = ?, wins = ? WHERE id = ?");
    stmt.run(playerData.games, playerData.wins, id);
    //send back new scoreboard
    const getScore = db.prepare("SELECT username, games, wins FROM users ");
    const scores = getScore.all();

    body = { number: rand, result: result , scores: scores};
    return new Response(JSON.stringify(body), { status, headers });
  }

  if (url.pathname === "/register" && request.method === "POST") {
    const { username, password } = await request.json();
    const stmt = db.prepare("INSERT INTO users (username, password, games, wins) VALUES (?, ?, ?, ?)");
    stmt.run(username, password, 0, 0);
    body = { message: "Successfully registered" };
    return new Response(JSON.stringify(body), { status, headers });
  }

  if (url.pathname === "/login" && request.method === "POST") {
    const { username, password } = await request.json();
    const stmt = db.prepare("SELECT id FROM users WHERE username = ? AND password = ?");
    const result = stmt.all(username, password);

    const getScore = db.prepare("SELECT username, games, wins FROM users ");
    const scores = getScore.all();
    //console.log(scores);

    if (result.length > 0) {
      body = { success: true, message: "Login ok", id: result[0].id, scores: scores };

    } else {
      status = 401;
      body = { success: false, message: "Login failed" };
    }
    return new Response(JSON.stringify(body), { status, headers });
  }

  // --- Fileserver für ./frontend ---
  return serveDir(request, {
    fsRoot: "./frontend",
    urlRoot: "",
    showDirListing: true,   // nützlich beim Entwickeln
    enableCors: true,       // praktisch für lokale Tests
  });

});

console.log(`Server läuft auf http://${hostname}:${port}/`);