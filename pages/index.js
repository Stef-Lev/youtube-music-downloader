import { useState } from "react";

const defaultUrls = ["uHjZphtQ5_Q", "yX0UE8BoUeQ", "fNrlgeMJgxU"];

export default function Home() {
  const [url, setUrl] = useState("");
  const [list, setList] = useState(defaultUrls);

  const handleChange = (ev) => {
    setUrl(ev.target.value);
  };

  const handleAddUrl = () => {
    if (url.length) {
      setList([...list, url]);
      setUrl("");
    }
  };

  const sendForConvertion = async (data) => {
    const response = await fetch("/api/convert", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: data }),
    });
    return response.json();
  };

  console.log(list);

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
    </div>
  );
}
