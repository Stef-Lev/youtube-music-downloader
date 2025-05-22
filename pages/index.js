import PageLink from "@/components/PageLink";

const HomePage = () => {
  return (
    <div className="h-[100dvh] p-4">
      <div className="flex flex-row items-center justify-center mb-[20px]">
        <h1 className="font-bold text-2xl p-4 text-[#7DF5A5]">
          Youtube Downloader App
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <PageLink
          title="Download Audio (.mp3)"
          href="/audio"
          downloadType="audio"
        />
        <PageLink
          title={"Download Video (.mp4)"}
          href={"/video"}
          downloadType="video"
        />
      </div>
    </div>
  );
};

export default HomePage;
