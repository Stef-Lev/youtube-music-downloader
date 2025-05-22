import { useRouter } from "next/router";

function BackHeader() {
  const router = useRouter();
  return (
    <div className="cursor-pointer p-4" onClick={() => router.back()}>
      <svg
        fill="#fff"
        width="40px"
        height="40px"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z" />
      </svg>
    </div>
  );
}

export default BackHeader;
