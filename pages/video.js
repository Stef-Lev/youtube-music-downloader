import { useRouter } from "next/router";
import Page from "@/components/Page";
import getStoredMedia from "helpers/getStoredMedia";
import pageData from "data/pageData";

export default function Video({ storedMedia }) {
  const router = useRouter();
  const path = router.pathname;
  const cleanPath = path.replace(/^\/+/, "");
  const { mediaKey, mediaType, directory, convertApi, socketEvent } =
    pageData[cleanPath];

  return (
    <Page
      mediaKey={mediaKey}
      mediaType={mediaType}
      directory={directory}
      convertApi={convertApi}
      socketEvent={socketEvent}
      storedMedia={storedMedia}
    />
  );
}

export async function getServerSideProps(ctx) {
  const path = ctx.resolvedUrl.replace(/^\/+/, "");

  const storedMedia = getStoredMedia(pageData[path].directory);
  return { props: { storedMedia } };
}
