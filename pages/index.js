import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Logo from "@/components/Logo";
// import { Puff } from "react-loader-spinner";
import getVideoId from "helpers/getVideoIDFromURL";
import { useRouter } from "next/router";
import ItemStatus from "@/components/ItemStatus";
import io from "socket.io-client";

const defaultUrls = ["uHjZphtQ5_Q", "yX0UE8BoUeQ", "fNrlgeMJgxU"];
// const defaultUrls = ["stefanos77"];

export default function Home({ storedSongs }) {
  const socket = useRef(null);
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [list, setList] = useState(defaultUrls);

  const [inProgress, setInProgress] = useState([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/convert");
    if (!socket.current) {
      socket.current = io();

      socket.current.on("connect", () => {
        console.log("connected");
      });

      socket.current.on("showError", (err) => {
        notify(err.message);
        console.log(err);
      });
      socket.current.on("showComplete", (response) => handleComplete(response));
      socket.current.on("showProgress", (data) => {
        setInProgress((prev) =>
          prev.map((item) => {
            if (item.id == data.id) {
              item.progress = data.progress;
            }
            return item;
          })
        );
      });
    }
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

  function notify(msg) {
    toast(msg, { type: "error" });
  }

  const sendForConvertion = async (list) => {
    const buildProgress = list.map((item) => ({ id: item, progress: 0 }));
    setInProgress(buildProgress);
    socket.current.emit("downloadVideos", list);
    setList([]);
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleComplete = (response) => {
    const { videoId } = response.data;
    setInProgress((prev) => prev.filter((item) => item.id != videoId));
    refreshData();
  };

  return (
    <div className=" flex flex-col items-center">
      <Logo />
      <div className="flex justify-center items-center w-full mb-[16px]">
        <h1 className="font-bold text-2xl">YouTube Music Downloader</h1>
      </div>
      <div className="flex justify-center items-center w-full">
        <p>Please add a valid YouTube url</p>
      </div>

      <div className="flex justify-center items-center w-full py-1 px-[10px]">
        <div className="flex items-center justify-center gap-3 w-[100%]">
          <input
            placeholder="https://www.youtube.com/watch?v=9bZkp7q19f0"
            className="px-2 rounded-md text-sm md:text-lg h-[40px] w-[70%] md:w-[500px]"
            type="text"
            value={url}
            onChange={handleChange}
          />
          <button
            className="bg-[#7DF5A5] rounded-md px-2 font-bold h-[40px] w-[30%] md:w-[160px]"
            onClick={() => handleAddUrl()}
          >
            Add url
          </button>
        </div>
      </div>
      <div>
        <ul>
          {list.map((item, index) => (
            <li key={index + 1}>{item}</li>
          ))}
        </ul>
      </div>
      <button
        className="bg-red-500 rounded-md py-2 w-[200px] text-2xl font-bold text-white"
        onClick={() => sendForConvertion(list)}
      >
        Convert
      </button>
      <hr className="w-full flex justify-center my-[16px]" />
      <div className="w-full flex justify-center">
        <div>
          <h3 className="text-center text-2xl font-bold mb-[10px]">
            Music Library
          </h3>
          <div className="px-[10px] pb-[80px]">
            {storedSongs.map((item, idx) => (
              <p
                className="text-[14px] bg-white rounded-md px-[5px] py-[2px] mb-[5px] shadow-lg"
                key={idx + 1}
              >
                {item}
              </p>
            ))}
          </div>
          <div>
            {inProgress.length > 0 &&
              inProgress.map((item) => (
                <ItemStatus key={item.id} item={item} />
              ))}
          </div>
        </div>
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
