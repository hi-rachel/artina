import { fetchArtworksByArtist } from "@/lib/metApi";
import { notFound } from "next/navigation";
import { artistMap } from "@/data/artistData";
import { Artwork } from "@/types/met";
import dynamic from "next/dynamic";

const GalleryWithArrows = dynamic(
  () => import("@/components/common/GalleryWithArrows"),
  { ssr: false }
);

// 빌드 시 정적 생성 비활성화 - 런타임에서 동적 생성
// export const generateStaticParams = () =>
//   Object.keys(artistMap).map((slug) => ({ artist: slug }));

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

  // 빌드 시 실패하는 작가들의 경우 런타임에서 재시도
  if (artworks.length === 0 && process.env.NODE_ENV === "production") {
    console.log(`Retrying ${name} at runtime...`);
    try {
      // 잠시 대기 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 1000));
      artworks = await fetchArtworksByArtist(name);
      console.log(
        `Runtime retry loaded ${artworks.length} artworks for ${name}`
      );
    } catch (retryError) {
      console.error("Runtime retry failed:", retryError);
    }
  }

  return <GalleryWithArrows artworks={artworks} artistName={name} />;
};

export default ArtistGalleryPage;
