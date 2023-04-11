import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import BackHeader from "@/components/BackHeader";
import Library from "@/components/Library";
import ItemStatus from "@/components/ItemStatus";
import DownloadForm from "@/components/DownloadForm";
import io from "socket.io-client";

export default function Home({ storedVideos }) {
  const socket = useRef(null);
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [download, setDownload] = useState(false);
  const [inProgress, setInprogress] = useState(null);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/convertVideo");
    if (!socket.current) {
      socket.current = io();

      socket.current.on("connect", () => {
        console.log("video connected");
      });

      socket.current.on("showError", (err) => {
        console.log("ERROR", err);
      });

      socket.current.on("showProgress", (msg) => {
        console.log("Progress:", msg);
        setInprogress(msg.percentage);
      });

      socket.current.on("showComplete", (response) => {
        handleComplete(response);
      });
    }
  };

  const handleChange = (ev) => {
    setUrl(ev.target.value);
  };

  const handleAddUrl = () => {
    console.log(url);
  };

  function notify(msg, options = {}) {
    toast(msg, { ...options });
  }

  const sendForConvertion = async () => {
    setDownload(true);
    socket.current.emit("downloadVideo", url);
    setUrl("");
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleComplete = (response) => {
    refreshData();
    console.log(response);
    setDownload(false);
    setInprogress(null);
    notify(response.msg, { type: "success" });
  };

  return (
    <div>
      <BackHeader />
      <div className="flex flex-col items-center">
        <Logo downloadType="video" />
        <DownloadForm
          downloadType="video"
          url={url}
          handleChange={handleChange}
          handleAddUrl={handleAddUrl}
          downloading={download}
          onSubmit={() => {
            sendForConvertion();
          }}
        />
        {inProgress && (
          <div className="w-full md:w-[620px] p-2">
            <ItemStatus item={{ progress: inProgress }} />
          </div>
        )}
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
  fs.readdirSync(mp4Folder).forEach((file) => {
    storedVideos.push(file);
  });

  return { props: { storedVideos } };
}
