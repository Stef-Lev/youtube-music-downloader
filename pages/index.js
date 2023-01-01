import { useState, useEffect } from "react";
import useLocalStorage from "helpers/useLocalStorage";
import io from "socket.io-client";
let socket;

const defaultUrls = ["uHjZphtQ5_Q", "yX0UE8BoUeQ", "fNrlgeMJgxU"];
// const defaultUrls = ["fNrlgeMJgxU"];

export default function Home({ songsList }) {
  const [url, setUrl] = useState("");
  const [list, setList] = useState(defaultUrls);
  // const [name, setName] = useLocalStorage("name", "Bob");
  const [progress, setProgress] = useState({});
  const perc = 33;

  useEffect(() => {
    console.log(songsList);
  }, [songsList]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/convert");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("showProgress", (msg) => console.log(msg));
    socket.on("showError", (msg) => console.log(msg));
    socket.on("showComplete", (msg) => console.log(msg));
  };

  const handleChange = (ev) => {
    setUrl(ev.target.value);
  };

  const handleAddUrl = () => {
    if (url.length) {
      // setList([...list, { id: url, status: "pending", fileName: "" }]);
      setList([...list, url]);
      setUrl("");
    }
  };

  const sendForConvertion = async (data) => {
    console.log("Sent...");
    socket.emit("downloadVideos", data);
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
      <button
        className="bg-purple-300 rounded-md py-2 w-[200px] text-2xl"
        onClick={() => fetch("/api/testApi")}
      >
        TestPath
      </button>
      <div className="my-4 w-[50%] h-5 bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className={`h-5 w-[50%] bg-blue-600 rounded-full dark:bg-blue-500`}
        ></div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const fs = require("fs");
  const path = require("path");

  const mp3Folder = path.join(process.cwd(), "mp3s");

  let songsList = [];
  fs.readdirSync(mp3Folder).forEach((file) => {
    console.log(file);
    songsList.push(file);
  });

  return { props: { songsList } };
}
