import { fetchArtworksByArtist } from "@/lib/metApi";
import { notFound } from "next/navigation";
import { artistMap } from "@/data/artistData";
import { Artwork } from "@/types/met";
import dynamic from "next/dynamic";

const GalleryWithArrows = dynamic(
  () => import("@/components/common/GalleryWithArrows"),
  { ssr: false }
);

export const generateStaticParams = () =>
  Object.keys(artistMap).map((slug) => ({ artist: slug }));

const ArtistGalleryPage = async ({
  params,
}: {
  params: { artist: string };
}) => {
  const slug = params.artist;
  const name = artistMap[slug];
  if (!name) return notFound();

  let artworks: Artwork[] = [];
  try {
    artworks = await fetchArtworksByArtist(name);
    console.log(`Loaded ${artworks.length} artworks for ${name}`);
  } catch (error) {
    console.error("Error loading artworks:", error);
    // 에러 발생 시 빈 배열 반환
  }

  return <GalleryWithArrows artworks={artworks} artistName={name} />;
};

export default ArtistGalleryPage;
