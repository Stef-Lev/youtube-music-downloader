import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import BackHeader from "@/components/BackHeader";
import Library from "@/components/Library";
import ItemStatus from "@/components/ItemStatus";
import DownloadForm from "@/components/DownloadForm";
import io from "socket.io-client";
import getVideoId from "helpers/getVideoIDFromURL";

export default function Home({ storedVideos }) {
  const socket = useRef(null);
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [download, setDownload] = useState(false);
  const [inProgress, setInprogress] = useState(null);
  const [stage, setStage] = useState("");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    try {
      await fetch("/api/convertVideo");
    } catch (err) {
      console.error("Failed to initialize socket server:", err);
      toast.error("Failed to connect to server.");
      return;
    }

    if (!socket.current) {
      socket.current = io();

      socket.current.on("connect", () => {
        console.log("Socket connected for video");
      });

      socket.current.on("showError", (err) => {
        console.error("Socket error:", err);
        toast.error(err);
        setDownload(false);
        setInprogress(null);
        setStage("");
      });

      socket.current.on("showProgress", (data) => {
        console.log("Progress:", data);

        setInprogress(data.percent);

        setStage(data.stage);
      });

      socket.current.on("showComplete", (response) => {
        handleComplete(response);
        setInprogress(null);
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
    console.log({ trimmedUrl });
    if (!trimmedUrl) {
      notify("Please enter a valid URL.", { type: "error" });
      return;
    }

    const videoId = getVideoId(trimmedUrl);
    console.log({ videoId });
    if (!videoId) {
      notify("Invalid YouTube URL.", { type: "error" });
      return;
    }

    // setDownload(true);
    socket.current.emit("downloadVideo", videoId); // send only the video ID
    setUrl("");
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleComplete = (response) => {
    refreshData();
    console.log("Conversion complete:", response);
    setDownload(false);
    setInprogress(null);
    notify(response.msg, { type: "success" });
  };

  console.log({ inProgress });

  return (
    <div>
      <BackHeader />
      <div className="flex flex-col items-center">
        <Logo downloadType="video" />
        <DownloadForm
          downloadType="video"
          url={url}
          handleChange={handleChange}
          downloading={download}
          onSubmit={sendForConvertion}
        />
        {storedVideos.length > 0 && <Library storedItems={storedVideos} />}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const fs = require("fs");
  const path = require("path");

  const mp4Folder = path.join(process.cwd(), "mp4s");

  let storedVideos = [];
  if (fs.existsSync(mp4Folder)) {
    storedVideos = fs.readdirSync(mp4Folder);
  }
  return { props: { storedVideos } };
}
