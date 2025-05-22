import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Logo from "@/components/Logo";
import BackHeader from "@/components/BackHeader";
import getVideoId from "helpers/getVideoIDFromURL";
import { useRouter } from "next/router";
import io from "socket.io-client";
import DownloadedFiles from "@/components/DownloadedFiles";
import DownloadForm from "@/components/DownloadForm";

export default function Home({ storedSongs }) {
  const socket = useRef(null);
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(null);
  const [stage, setStage] = useState("");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    try {
      await fetch("/api/convertAudio"); // 👈 updated route here
    } catch (err) {
      console.error("Failed to initialize socket server:", err);
      toast.error("Failed to connect to server.");
      return;
    }

    if (!socket.current) {
      socket.current = io();

      socket.current.on("connect", () => {
        console.log("Socket connected for audio");
      });

      socket.current.on("showError", (err) => {
        console.error("Socket error:", err);
        toast.error(err);
        setProgress(null);
        setStage("");
      });

      socket.current.on("showProgress", (data) => {
        console.log("Progress:", data);
        setProgress(data.percent);
        setStage(data.stage);
      });

      socket.current.on("showComplete", (response) => {
        handleComplete(response);
        setProgress(null);
        setStage("");
      });
    }
  };

  const handleChange = (ev) => {
    setUrl(ev.target.value);
  };

  function notify(msg, options = {}) {
    toast(msg, { ...options });
  }

  const sendForConvertion = () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      notify("Please enter a valid URL.", { type: "error" });
      return;
    }
    const videoId = getVideoId(trimmedUrl);
    if (!videoId) {
      notify("Invalid YouTube URL.", { type: "error" });
      return;
    }
    socket.current.emit("downloadAudio", videoId);
    setUrl("");
    console.log("started", videoId);
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleComplete = (response) => {
    refreshData();
    console.log("Conversion complete:", response);
    setProgress(null);
    notify(response.msg, { type: "success" });
  };

  return (
    <div>
      <BackHeader />
      <div className="flex flex-col items-center">
        <Logo downloadType="audio" />
        <DownloadForm
          downloadType="audio"
          url={url}
          handleChange={handleChange}
          progress={progress}
          stage={stage}
          onSubmit={sendForConvertion}
        />
        {storedSongs.length > 0 && (
          <DownloadedFiles storedItems={storedSongs} />
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
