import Page from "@/components/Page";
import getStoredMedia from "helpers/getStoredMedia";
import pageData from "data/pageData";

const Slug = ({ storedMedia, slug }) => {
  const { mediaType, directory, convertApi, socketEvent } = pageData[slug];

  return (
    <Page
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

  const storedMedia = getStoredMedia(pageData[slug].directory).filter(
    (item) => item !== "temp"
  );
  return { props: { storedMedia, slug } };
}
