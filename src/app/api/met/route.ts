import { NextRequest, NextResponse } from "next/server";
import { MetApiResponse } from "@/types/met";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist");
  const max = searchParams.get("max") || "50"; // MVP: 50개로 제한

  console.log(`API Request for artist: ${artist}, max: ${max}`);

  if (!artist) {
    return NextResponse.json(
      { error: "Artist parameter is required" },
      { status: 400 }
    );
  }

  try {
    // 1. 검색 API 호출
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?artistOrCulture=true&q=${encodeURIComponent(
      artist
    )}`;

    console.log(`Searching for: ${searchUrl}`);

    const searchRes = await fetch(searchUrl);

    if (!searchRes.ok) {
      console.error(
        `Search API failed: ${searchRes.status} - ${searchRes.statusText}`
      );
      throw new Error(`Search API failed: ${searchRes.status}`);
    }

    const searchData = (await searchRes.json()) as MetApiResponse;
    console.log(`Search response:`, searchData);

    const { objectIDs } = searchData;

    if (!objectIDs || objectIDs.length === 0) {
      console.log(`No artworks found for artist: ${artist}`);
      return NextResponse.json([]);
    }

    console.log(`Found ${objectIDs.length} artworks for ${artist}`);

    // 2. 상세 정보 API 호출 (배치 처리) - MVP: 50개로 제한
    const candidates = objectIDs.slice(0, 50); // MVP: 50개로 제한
    const batchSize = 5; // 안정적인 배치 크기
    const batches = [];

    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize);
      batches.push(batch);
    }

    const allArtworks = [];

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(
        `Processing batch ${batchIndex + 1}/${batches.length} with ${
          batch.length
        } items`
      );

      const batchPromises = batch.map(async (id: number) => {
        try {
          const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
          const response = await fetch(objectUrl);

          if (!response.ok) {
            console.warn(`Failed to fetch object ${id}: ${response.status}`);
            return null;
          }

          const artworkData = (await response.json()) as MetApiResponse;
          return artworkData;
        } catch (error) {
          console.warn(`Error fetching object ${id}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter(Boolean);
      allArtworks.push(...validResults);

      console.log(
        `Batch ${batchIndex + 1} completed: ${validResults.length}/${
          batch.length
        } successful`
      );

      // 배치 간 잠시 대기 (rate limiting 방지)
      if (batchIndex < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 안정적인 대기 시간
      }
    }

    console.log(`Total artworks fetched: ${allArtworks.length}`);

    // 3. 결과 필터링 및 변환
    function isPublicDomainTrue(val: unknown): boolean {
      if (typeof val === "boolean") return val === true;
      if (typeof val === "string") return val.toLowerCase() === "true";
      return false;
    }

    const allArtworksTyped: MetApiResponse[] = allArtworks as MetApiResponse[];
    const filteredArtworks = allArtworksTyped.filter((art) => {
      if (!art) return false;
      const hasImage =
        art.primaryImage &&
        typeof art.primaryImage === "string" &&
        art.primaryImage.trim() !== "";
      const isPublic = isPublicDomainTrue(art.isPublicDomain ?? false);
      return hasImage && isPublic;
    });

    console.log(
      `Filtered artworks with images and public domain: ${filteredArtworks.length}`
    );

    const result = filteredArtworks
      .slice(0, parseInt(max))
      .map((art: MetApiResponse) => {
        // 실제 작품 설명을 우선적으로 찾기
        let description = "";

        // 1. objectDescription (가장 상세한 설명)
        if (art.objectDescription && art.objectDescription.trim() !== "") {
          description = art.objectDescription;
        }
        // 2. culture (문화적 배경)
        else if (art.culture && art.culture.trim() !== "") {
          description = `This artwork represents ${art.culture} culture and artistic tradition.`;
        }
        // 3. period (시대 정보)
        else if (art.period && art.period.trim() !== "") {
          description = `This artwork was created during the ${art.period} period.`;
        }
        // 4. 기본 설명
        else {
          description = `A beautiful artwork by ${
            art.artistDisplayName || "an unknown artist"
          }.`;
        }

        return {
          id: art.objectID,
          title: art.title,
          artist: art.artistDisplayName || "Unknown Artist",
          year: art.objectDate || "Unknown Date",
          medium: art.medium || "Unknown Medium",
          dimensions: art.dimensions || "Unknown Dimensions",
          location: art.repository || "Unknown Location",
          imageUrl: art.primaryImage,
          description: description,
          culture: art.culture || "",
          period: art.period || "",
          classification: art.classification || "",
          department: art.department || "",
        };
      });

    console.log(`Returning ${result.length} artworks for ${artist}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}
