const fs = require("fs");
const path = require("path");

export default function getStoredMedia(dir) {
  const mediaFolder = path.join(process.cwd(), dir);
  let storedMedia = [];
  if (fs.existsSync(mediaFolder)) {
    storedMedia = fs.readdirSync(mediaFolder);
  }

  return storedMedia;
}
