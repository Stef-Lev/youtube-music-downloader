import PageLink from "@/components/PageLink";

const HomePage = () => {
  return (
    <div className="h-[100dvh] p-4">
      <div className="flex flex-row items-center justify-center mb-[20px]">
        <h1 className="font-bold text-2xl p-4 text-[#7DF5A5]">
          Audio and Video Downloader App
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <PageLink
          title="Youtube to mp3"
          href="/converter/audio"
          downloadType="youtubeAudio"
        />
        <PageLink
          title="Youtube to mp4"
          href="/converter/video"
          downloadType="youtubeVideo"
        />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
        <PageLink
          title="Video stream to mp4"
          href="/converter/stream"
          downloadType="videoStream"
        />
        <PageLink
          title="Instagram to mp4"
          href="/converter/instagram"
          downloadType="instagram"
        />
      </div>
    </div>
  );
};

export default HomePage;
