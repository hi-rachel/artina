import { Artwork } from "@/types/met";

export const fetchArtworksByArtist = async (
  artistName: string,
  max: number = 200
): Promise<Artwork[]> => {
  const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?artistOrCulture=true&q=${encodeURIComponent(
    artistName
  )}`;
  const searchRes = await fetch(searchUrl);
  const { objectIDs } = await searchRes.json();

  if (!objectIDs || objectIDs.length === 0) return [];

  const candidates = objectIDs.slice(0, 300);

  const responses = await Promise.allSettled(
    candidates.map((id: string) =>
      fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
      ).then((res) => res.json())
    )
  );

  return responses
    .filter(
      (res): res is PromiseFulfilledResult<Record<string, any>> =>
        res.status === "fulfilled"
    )
    .map((res) => res.value)
    .filter((art) => art.primaryImage && art.isPublicDomain)
    .slice(0, max)
    .map((art) => ({
      imageUrl: art.primaryImage,
      title: art.title,
      year: art.objectDate,
      artist: art.artistDisplayName,
      medium: art.medium,
      dimensions: art.dimensions,
      description: art.creditLine,
    }));
};
