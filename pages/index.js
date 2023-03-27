import { useRouter } from "next/router";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      <Link href="/audio">Audio</Link>
      <Link href="/video">Video</Link>
    </div>
  );
};

export default HomePage;
