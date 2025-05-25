import { useState, useRef, useEffect } from "react";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import BackHeader from "@/components/BackHeader";
import DownloadedFiles from "@/components/DownloadedFiles";
import DownloadForm from "@/components/DownloadForm";
import io from "socket.io-client";
import notify from "helpers/notify";
import updateInput from "helpers/updateInput";

export default function Instagram({ storedVideos }) {
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
      await fetch("/api/convertInstagram");
    } catch (err) {
      console.error("Failed to initialize socket server:", err);
      notify("Failed to connect to server.", { type: "error" });
      return;
    }

    if (!socket.current) {
      socket.current = io();

      socket.current.on("connect", () => {
        console.log("Socket connected for video");
      });

      socket.current.on("showError", (err) => {
        console.error("Socket error:", err);
        notify(err, { type: "error" });
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

  const sendForConvertion = () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      notify("Please enter a valid URL.", { type: "error" });
      return;
    }
    console.log({ url, trimmedUrl });
    socket.current.emit("downloadInstagram", trimmedUrl);
    setUrl("");
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
        <Logo downloadType="video" />
        <DownloadForm
          downloadType="videoStream"
          url={url}
          handleChange={(ev) => updateInput(ev, setUrl)}
          progress={progress}
          stage={stage}
          onSubmit={sendForConvertion}
        />
        {storedVideos.length > 0 && (
          <DownloadedFiles storedItems={storedVideos} />
        )}
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
