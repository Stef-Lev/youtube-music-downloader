import Link from "next/link";
import Logo from "@/components/Logo";

const HomePage = () => {
  const routeBtn =
    "bg-[#7DF5A5] rounded-[30px] py-2 px-[40px] text-xl font-extrabold";
  return (
    <div>
      <div className="flex flex-row items-center justify-center mb-[20px]">
        <h1 className="font-bold text-2xl p-4">Youtube Downloader App</h1>
      </div>

      <div className="flex flex-row items-center justify-center gap-4 h-[200px]">
        <div>
          <Link className={routeBtn} href="/audio">
            Download Audio (.mp3)
          </Link>
          <div className="mt-[20px]">
            <Logo downloadType="audio" />
          </div>
        </div>

        <div>
          <Link className={routeBtn} href="/video">
            Download Video (.mp4)
          </Link>
          <div className="mt-[20px]">
            <Logo downloadType="video" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
