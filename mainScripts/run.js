const { spawn } = require("child_process");
const os = require("os");
const path = require("path");

const platform = os.platform();
const appDir =
  platform === "win32" ? "C:\\my-nextjs-app" : "/usr/local/my-nextjs-app";

// === Start Next.js server ===
console.log("🚀 Starting Next.js app...");
const nextProcess = spawn("npm", ["run", "start"], {
  cwd: appDir,
  shell: true,
  stdio: "inherit",
});

// === Wait a few seconds before launching browser ===
setTimeout(() => {
  let chromePath;

  if (platform === "win32") {
    chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  } else if (platform === "darwin") {
    chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else {
    chromePath = "google-chrome";
  }

  console.log("🌐 Opening browser...");
  const chrome = spawn(chromePath, ["http://localhost:3000"], {
    detached: false,
    stdio: "ignore",
  });

  chrome.on("exit", () => {
    console.log("❌ Chrome closed. Stopping Next.js...");
    nextProcess.kill();
    process.exit(0);
  });
}, 3000);
