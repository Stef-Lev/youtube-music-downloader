import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Logo from "@/components/Logo";
// import { Puff } from "react-loader-spinner";
import getVideoId from "helpers/getVideoIDFromURL";
import { useRouter } from "next/router";
import ItemStatus from "@/components/ItemStatus";
import UrlTabs from "@/components/UrlTabs";
import io from "socket.io-client";
import MusicLibrary from "@/components/MusicLibrary";
import DownloadForm from "@/components/DownloadForm";

// const defaultUrls = ["uHjZphtQ5_Q", "yX0UE8BoUeQ", "fNrlgeMJgxU"];
// const defaultUrls = ["stefanos77"];

export default function Home({ storedSongs }) {
  const socket = useRef(null);
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [list, setList] = useState([]);

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
        notify(err.message, { type: "error" });
        setInProgress([]);
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

  function notify(msg, options = {}) {
    toast(msg, { ...options });
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
    <div className="flex flex-col items-center">
      <Logo />
      <DownloadForm
        url={url}
        handleChange={handleChange}
        handleAddUrl={handleAddUrl}
        onSubmit={() => sendForConvertion(list)}
      />
      <UrlTabs urls={list} />
      {inProgress.length > 0 && (
        <div className="w-full md:w-[620px] p-2">
          {inProgress.map((item) => (
            <ItemStatus key={item.id} item={item} />
          ))}
        </div>
      )}

      <MusicLibrary storedSongs={storedSongs} />
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
