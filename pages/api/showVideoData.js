const yt = require("yt-converter");

export default async function handler(req, res) {
  const { vidUrl } = req.body;
  const data = await yt.getInfo(vidUrl).then((info) => info);
  res.status(200).json({ data });
}
