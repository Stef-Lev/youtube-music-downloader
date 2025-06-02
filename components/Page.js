import { useState, useRef, useEffect, useCallback } from "react";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import BackHeader from "@/components/BackHeader";
import DownloadedFiles from "@/components/DownloadedFiles";
import DownloadForm from "@/components/DownloadForm";
import NoMediaMessage from "./NoMediaMessage";
import io from "socket.io-client";
import notify from "helpers/notify";

export default function Page({ mediaType, socketEvent, storedMedia }) {
  const socket = useRef(null);
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(null);
  const [stage, setStage] = useState("");

  useEffect(() => {
    socketInitializer();
    const onUnload = () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log("Socket disconnected on unload.");
      }
    };

    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const socketInitializer = async () => {
    try {
      await fetch("/api/socket");
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

  const sendForConvertion = useCallback(() => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      notify("Please enter a valid URL.", { type: "error" });
      return;
    }

    if (!socket.current || !socket.current.connected) {
      notify("Socket is not connected yet. Please wait a moment.", {
        type: "error",
      });
      return;
    }

    socket.current.emit(socketEvent, trimmedUrl);
    setUrl("");
  }, [url, socketEvent]);

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
  console.log({ storedMedia });

  const withMedia = (storedMedia) => {
    if (storedMedia.length === 0) {
      return false;
    }
    if (storedMedia.length === 1 && storedMedia.includes("temp")) {
      return false;
    }
    if (storedMedia.length > 0) {
      return true;
    }
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
        {withMedia(storedMedia) ? (
          <DownloadedFiles storedItems={storedMedia} />
        ) : (
          <NoMediaMessage />
        )}
      </div>
    </div>
  );
}
