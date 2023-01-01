const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
  const { file } = req.body;
  const filePath = path.join(
    process.cwd(),
    "mp3s",
    "[FREE] 22Gz NYUK Drill Type Beat - Warning (Prod. By RicoRunDat).mp3"
  );
  console.log(filePath);
  console.log(fs.existsSync(filePath));

  const testFolder = path.join(process.cwd(), "mp3s");

  let list = [];
  fs.readdirSync(testFolder).forEach((file) => {
    console.log(file);
    list.push(file);
  });

  if (fs.existsSync(filePath)) {
    res.status(200).json({ path: filePath, list });
  } else {
    res.status(404).json({ path: "Not Found" });
  }
}
