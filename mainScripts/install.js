const os = require("os");
const { execSync } = require("child_process");
const fs = require("fs");
const https = require("https");
const path = require("path");

const platform = os.platform();
const baseDir = platform === "win32" ? "C:\\tools" : "/usr/local/tools";
const targetPath =
  platform === "win32" ? "C:\\my-nextjs-app" : "/usr/local/my-nextjs-app";

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`⬇️  Downloading ${url}...`);
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", reject);
  });
}

(async () => {
  console.log("Detected OS:", platform);

  // === Clone repo ===
  if (!fs.existsSync(targetPath)) {
    console.log("📂 Cloning repo into", targetPath);
    execSync(
      `git clone https://github.com/Stef-Lev/youtube-music-downloader.git "${targetPath}"`,
      { stdio: "inherit" }
    );
  } else {
    console.log("🔄 Repo already exists at", targetPath);
    console.log("Updating with git pull...");
    execSync("git pull", { cwd: targetPath, stdio: "inherit" });
  }

  process.chdir(targetPath);

  // === Install dependencies ===
  console.log("📦 Installing dependencies...");
  execSync("npm install", { stdio: "inherit" });

  // === Build Next.js ===
  console.log("⚙️ Building Next.js...");
  execSync("npm run build", { stdio: "inherit" });

  // === yt-dlp ===
  let ytUrl;
  let ytDest;
  if (platform === "win32") {
    ytUrl =
      "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";
    ytDest = path.join(baseDir, "yt-dlp.exe");
  } else {
    ytUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";
    ytDest = path.join(baseDir, "yt-dlp");
  }

  await download(ytUrl, ytDest);
  if (platform !== "win32") {
    execSync(`chmod +x "${ytDest}"`);
  }
  console.log("✅ yt-dlp installed at", ytDest);

  // === ffmpeg ===
  if (platform === "win32") {
    const ffmpegZip = path.join(baseDir, "ffmpeg.zip");
    await download(
      "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip",
      ffmpegZip
    );
    execSync(
      `powershell -Command "Expand-Archive -Force '${ffmpegZip}' '${baseDir}'"`
    );
    fs.unlinkSync(ffmpegZip);
    console.log("✅ ffmpeg extracted to", baseDir);
  } else if (platform === "darwin") {
    try {
      execSync("brew install ffmpeg", { stdio: "inherit" });
      console.log("✅ ffmpeg installed via Homebrew");
    } catch {
      console.error(
        "⚠️  Homebrew not installed. Install it first: https://brew.sh/"
      );
    }
  } else if (platform === "linux") {
    try {
      execSync("sudo apt-get update && sudo apt-get install -y ffmpeg", {
        stdio: "inherit",
      });
      console.log("✅ ffmpeg installed via apt-get");
    } catch {
      console.error(
        "⚠️ Could not install ffmpeg automatically. Please install manually."
      );
    }
  }

  console.log("🎉 Setup complete.");
})();
