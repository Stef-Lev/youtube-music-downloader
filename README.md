# YouTube Music Downloader

A local desktop app to download YouTube music, built with Next.js, yt-dlp, and ffmpeg.

---

## Prerequisites

Before installing the app, make sure your system meets the following requirements:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (to clone the repository)
- **Chrome** or another modern browser

---

## Installation

### 1. Install Node.js and npm

#### Windows / macOS / Linux:

1. Go to the [Node.js official website](https://nodejs.org/)
2. Download the **LTS** version
3. Install Node.js (npm comes bundled)

Verify installation:

```sh
node -v
npm -v
git --version
```

---

### 2. Setup the App

1. Open a terminal (Command Prompt / PowerShell on Windows, Terminal on macOS/Linux)
2. Clone the repository and install dependencies:

```sh
# Navigate to the folder where you want to install the app
cd C:\Users\YourName\Downloads   # Windows example
# OR
cd ~/Downloads                   # macOS/Linux

# Clone the repository
git clone https://github.com/Stef-Lev/youtube-music-downloader.git my-nextjs-app

# Go into the app folder
cd my-nextjs-app

# Install dependencies
npm install

# Build the Next.js app
npm run build
```

3. Download necessary binaries:

- **yt-dlp** → https://github.com/yt-dlp/yt-dlp/releases/latest
- **ffmpeg**:
  - Windows → https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
  - macOS → `brew install ffmpeg` (requires Homebrew)
  - Linux → `sudo apt-get install ffmpeg`

Or use the included **`install.js`** script to automate everything:

```sh
node install.js
```

This script will:

- Clone or update the repository
- Install dependencies
- Build the app
- Download yt-dlp and ffmpeg

---

## Running the App

Use the included **`run.js`** script:

```sh
node run.js
```

This will:

- Start the Next.js server locally (`localhost:3000`)
- Open Chrome (or the default browser) to the app
- Stop the server automatically when Chrome is closed

---

### Optional: npm scripts

You can add these to your `package.json` for convenience:

```json
"scripts": {
  "install-app": "node install.js",
  "start-app": "node run.js"
}
```

Then run:

```sh
npm run install-app
npm run start-app
```

---

## Notes

- Ensure **Chrome** is installed for auto-launch; otherwise, the app may open in the default browser.
- yt-dlp and ffmpeg must be installed correctly.
- Node.js is required. If you want a fully standalone app (no Node.js), consider bundling with **Electron** or creating an executable with **pkg**.
