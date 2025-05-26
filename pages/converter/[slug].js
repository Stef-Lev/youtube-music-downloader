import Page from "@/components/Page";
import getStoredMedia from "helpers/getStoredMedia";
import pageData from "data/pageData";

const Slug = ({ storedMedia, slug }) => {
  const { mediaKey, mediaType, directory, convertApi, socketEvent } =
    pageData[slug];

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
};

export default Slug;

export async function getServerSideProps(ctx) {
  const validSlugs = ["audio", "video", "stream", "instagram"];
  const { slug } = ctx.params;

  if (!validSlugs.includes(slug)) {
    return {
      notFound: true,
    };
  }

  const storedMedia = getStoredMedia(pageData[slug].directory);
  return { props: { storedMedia, slug } };
}
