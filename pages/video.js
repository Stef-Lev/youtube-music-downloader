import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import Image from "next/image";
import io from "socket.io-client";
import MusicLibrary from "@/components/MusicLibrary";
import DownloadForm from "@/components/DownloadForm";

export default function Home({ storedSongs }) {
  const socket = useRef(null);
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState("");
  const [download, setDownload] = useState(false);

  const handleChange = (ev) => {
    setUrl(ev.target.value);
  };

  const handleAddUrl = () => {
    if (url.length) {
      fetch("/api/showVideoData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vidUrl: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => setVideoData(data.data));
      setUrl("");
    }
  };

  function notify(msg, options = {}) {
    toast(msg, { ...options });
  }

  const sendForConvertion = async (list) => {
    if (list.length === 0) {
      notify("Please add a url first!", { type: "warning" });
      return;
    }
    const buildProgress = list.map((item) => ({ id: item, progress: 0 }));
    setInProgress(buildProgress);
    socket.current.emit("downloadVideos", list);
    setList([]);
    setDownload(true);
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleComplete = (response) => {
    const { videoId } = response.data;
    setInProgress((prev) => prev.filter((item) => item.id != videoId));
    refreshData();
    setDownload(false);
  };

  //   ypoga
  //https://www.youtube.com/watch?v=VF9PKkZgFy4

  console.log("videoData", videoData);

  return (
    <div className="flex flex-col items-center">
      <Logo downloadType="video" />
      <DownloadForm
        downloadType="video"
        url={url}
        handleChange={handleChange}
        handleAddUrl={handleAddUrl}
        downloading={download}
        onSubmit={() => sendForConvertion(list)}
      />
      {videoData && (
        <div>
          <h1 className="text-center text-lg">{videoData.title}</h1>
          <div>
            <Image
              alt="thumbnail"
              src={videoData.thumbnails[4].url}
              height={960}
              width={540}
            />
          </div>
        </div>
      )}
      {videoData &&
        videoData.formatsVideo.map((item, idx) => {
          if (item.container === "mp4") {
            return (
              <div key={idx + 1}>
                {item.container} {item.qualityLabel}
              </div>
            );
          } else {
            return null;
          }
        })}
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
