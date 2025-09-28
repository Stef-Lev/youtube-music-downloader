// setup.js
const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const https = require("https");
const os = require("os");

const repoUrl = "https://github.com/Stef-Lev/youtube-music-downloader.git";
const targetDir = path.join(process.cwd(), "youtube-music-downloader");

// Helper: download file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200)
          return reject(new Error(`Download failed: ${url}`));
        res.pipe(file);
        file.on("finish", () => {
          file.close(() => resolve(dest));
        });
      })
      .on("error", reject);
  });
}

(async () => {
  try {
    // Clone repo if not already present
    if (!fs.existsSync(targetDir)) {
      console.log("📂 Cloning repository...");
      execSync(`git clone ${repoUrl} "${targetDir}"`, { stdio: "inherit" });
    } else {
      console.log("🔄 Repo already exists, updating...");
      execSync("git pull", { cwd: targetDir, stdio: "inherit" });
    }

    // Install & build
    console.log("📦 Installing dependencies...");
    execSync("npm install", { cwd: targetDir, stdio: "inherit" });

    console.log("⚙️ Building app...");
    execSync("npm run build", { cwd: targetDir, stdio: "inherit" });

    // Download yt-dlp
    const platform = os.platform();
    let ytUrl, ytDest;
    if (platform === "win32") {
      ytUrl =
        "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";
      ytDest = path.join(targetDir, "yt-dlp.exe");
    } else {
      ytUrl =
        "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";
      ytDest = path.join(targetDir, "yt-dlp");
    }

    if (!fs.existsSync(ytDest)) {
      console.log("⬇️ Downloading yt-dlp...");
      await downloadFile(ytUrl, ytDest);
      if (platform !== "win32") execSync(`chmod +x ${ytDest}`);
    }

    // TODO: Add ffmpeg download or instruct user separately

    // Start app
    console.log("🚀 Starting app...");
    const server = spawn("npm", ["run", "start"], {
      cwd: targetDir,
      stdio: "inherit",
    });

    // Open browser
    if (platform === "win32") {
      spawn("cmd", ["/c", "start", "http://localhost:3000"]);
    } else if (platform === "darwin") {
      spawn("open", ["http://localhost:3000"]);
    } else {
      spawn("xdg-open", ["http://localhost:3000"]);
    }

    // Stop server on exit
    process.on("SIGINT", () => {
      server.kill("SIGINT");
      process.exit();
    });
  } catch (err) {
    console.error("❌ Setup failed:", err.message);
    process.exit(1);
  }
})();
