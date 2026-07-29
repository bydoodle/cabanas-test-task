import { spawn } from "child_process";

const args = process.argv.slice(2);

const server = spawn(
  "npx",
  ["tsx", "server/server.ts", ...args],
  { stdio: "inherit", shell: true }
);

const vite = spawn(
  "npx",
  ["vite"],
  { stdio: "inherit", shell: true }
);

process.on("SIGINT", () => {
  server.kill();
  vite.kill();
});