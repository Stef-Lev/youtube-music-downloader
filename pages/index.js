import { useState, useEffect } from "react";
import io from "socket.io-client";
let socket;

// const defaultUrls = ["uHjZphtQ5_Q", "yX0UE8BoUeQ", "fNrlgeMJgxU"];
const defaultUrls = ["fNrlgeMJgxU"];

export default function Home() {
  const [url, setUrl] = useState("");
  const [list, setList] = useState(defaultUrls);
  const [progress, setProgress] = useState({});

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
  };

  const handleChange = (ev) => {
    setUrl(ev.target.value);
  };

  const handleAddUrl = () => {
    if (url.length) {
      setList([...list, url]);
      setUrl("");
    }
  };

  // const sendForConvertion = async (data) => {
  //   console.log("Sent...");
  //   const response = await fetch("/api/convert", {
  //     method: "POST",
  //     mode: "cors",
  //     cache: "no-cache",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ urls: data }),
  //   });
  //   return response;
  // };

  // Using only webSocket
  const sendForConvertion = async (data) => {
    console.log("Sent...");
    socket.emit("downloadVideos", data);
  };

  // console.log(list);

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

      {/* <input
        className="px-2 py-1 rounded-md text-lg w-1/3"
        type="text"
        value={socketTest}
        onChange={handleSocket}
      />
      <h2 className="text-red-500">{socketResponse}</h2>
      <button
        className="bg-blue-300 rounded-md py-2 w-[200px] text-2xl"
        onClick={() => socket.emit("sentTest", socketTest)}
      >
        Send Socket
      </button>
      <div>Client counter: {counter}</div>
      <div className=" text-2xl">Server progress: {progress}</div> */}
    </div>
  );
}
