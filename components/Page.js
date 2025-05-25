import { useState, useRef, useEffect } from "react";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import BackHeader from "@/components/BackHeader";
import DownloadedFiles from "@/components/DownloadedFiles";
import DownloadForm from "@/components/DownloadForm";
import io from "socket.io-client";
import notify from "helpers/notify";
import updateInput from "helpers/updateInput";
import pageData from "data/pageData";

export default function Page({
  mediaType,
  convertApi,
  socketEvent,
  storedMedia,
}) {
  const socket = useRef(null);
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(null);
  const [stage, setStage] = useState("");

  useEffect(() => {
    socketInitializer();
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
        console.log("Socket disconnected on cleanup.");
      }
    };
  }, []);

  const socketInitializer = async () => {
    try {
      await fetch(`/api/${convertApi}`);
    } catch (err) {
      console.error("Failed to initialize socket server:", err);
      notify("Failed to connect to server.", { type: "error" });
      return;
    }

    if (!socket.current) {
      socket.current = io();

      socket.current.on("connect", () => {
        console.log("Socket connected!");
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
    socket.current.emit(socketEvent, trimmedUrl);
    setUrl("");
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleChange = (ev) => {
    setUrl(ev.target.value);
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
        <Logo downloadType={mediaType} />
        <DownloadForm
          downloadType={mediaType}
          url={url}
          handleChange={handleChange}
          progress={progress}
          stage={stage}
          onSubmit={sendForConvertion}
        />
        {storedMedia.length > 0 && (
          <DownloadedFiles storedItems={storedMedia} />
        )}
      </div>
    </div>
  );
}
