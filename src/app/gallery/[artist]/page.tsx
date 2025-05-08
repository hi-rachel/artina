import { fetchArtworksByArtist } from "@/lib/metApi";
import { notFound } from "next/navigation";
import ArtworkCard from "@/components/common/ArtworkCard";
import { artistMap } from "@/data/artistData";

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

  const artworks = await fetchArtworksByArtist(name);

  return (
    <main className="bg-[#fdf6e3] text-black px-4 py-8 h-screen overflow-hidden">
      <h1 className="text-3xl font-bold text-center font-display">{name}</h1>
      <div className=" flex overflow-x-scroll overflow-y-hidden gap-6 px-4 snap-x snap-mandatory scrollable-x">
        {artworks.map((art, idx) => (
          <div key={idx} className="snap-center shrink-0 w-[80vw] sm:w-[60vw]">
            <ArtworkCard
              image={art.imageUrl}
              title={art.title}
              year={art.year}
              artist={art.artist}
              medium={art.medium}
              dimensions={art.dimensions}
              description={art.description}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default ArtistGalleryPage;
