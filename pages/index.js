import { useState, useEffect } from "react";
import { Puff } from "react-loader-spinner";
import getVideoId from "helpers/getVideoIDFromURL";
import { useRouter } from "next/router";
import ItemStatus from "@/components/ItemStatus";
import io from "socket.io-client";
let socket;

const defaultUrls = ["uHjZphtQ5_Q", "yX0UE8BoUeQ", "fNrlgeMJgxU"];
// const defaultUrls = ["fNrlgeMJgxU"];

export default function Home({ storedSongs }) {
  const [url, setUrl] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const perc = 33;
  const router = useRouter();

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/convert");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("showProgress", (data) => {
      setLoading(true);
    });
    socket.on("showError", (msg) => console.log("error", msg));
    socket.on("showComplete", () => handleComplete());
  };

  const handleChange = (ev) => {
    setUrl(ev.target.value);
  };

  const handleAddUrl = () => {
    if (url.length) {
      let videoId = getVideoId(url);
      setList([...list, videoId]);
      setUrl("");
    }
  };

  const sendForConvertion = async (list) => {
    socket.emit("downloadVideos", list);
    setLoading(true);
    setList([]);
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleComplete = () => {
    setLoading(false);
    refreshData();
  };

  return (
    <div className="bg-red-100 h-[100vh] flex flex-col items-center">
      <h1 className="font-bold text-3xl">YouTube Music Downloader</h1>

      <div className="flex justify-center gap-2 w-full py-5">
        <input
          className="px-2 py-1 rounded-md text-lg w-1/3"
          type="text"
          value={url}
          onChange={handleChange}
        />
        <button
          className="bg-green-300 rounded-md px-2 py-1"
          onClick={() => handleAddUrl()}
        >
          Add url
        </button>
      </div>
      <div>
        <ul>
          {list.map((item, index) => (
            <li key={index + 1}>{item}</li>
          ))}
        </ul>
      </div>
      <button
        className="bg-orange-300 rounded-md py-2 w-[200px] text-2xl"
        onClick={() => sendForConvertion(list)}
      >
        Convert
      </button>

      <div>
        <h3>Complete mp3s</h3>
        <div>
          {storedSongs.map((item, idx) => (
            <div key={idx + 1}>{item}</div>
          ))}
        </div>
        {loading && (
          <div className="w-full mt-[20px]">
            <p className="text-center my-[20px]">Downloading</p>
            <Puff
              height="80"
              width="100%"
              radius={1}
              color="#4fa94d"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const fs = require("fs");
  const path = require("path");

  const mp3Folder = path.join(process.cwd(), "mp3s");

  let storedSongs = [];
  fs.readdirSync(mp3Folder).forEach((file) => {
    storedSongs.push(file);
  });

  return { props: { storedSongs } };
}
