import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

const PageLink = (props) => {
  const { title, href, downloadType } = props;
  const routeBtn =
    "bg-greenLight rounded-[10px] text-lg font-bold py-2 flex justify-center";
  const router = useRouter();

  return (
    <div
      className="rounded-[20px] p-3 border-2 border-solid border-greenLight w-full md:w-[300px] lg:w-[400px] cursor-pointer"
      onClick={() => router.push(href)}
    >
      <div className={routeBtn} href={href}>
        {title}
      </div>
      <div className="mt-[20px]">
        <Logo downloadType={downloadType} />
      </div>
    </div>
  );
};

export default PageLink;
