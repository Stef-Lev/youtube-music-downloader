import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import c from "clsx";

const PageLink = (props) => {
  const { title, href, downloadType } = props;
  const router = useRouter();
  const routeBtn = c(
    "flex justify-center",
    "py-2",
    "rounded-[10px]",
    "bg-greenLight",
    "text-lg font-bold"
  );

  return (
    <div
      className={c(
        "w-full md:w-[300px] lg:w-[400px]",
        "border-2 border-solid border-greenLight",
        "p-3",
        "rounded-[20px]",
        "cursor-pointer"
      )}
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
