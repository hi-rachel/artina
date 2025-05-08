export interface Artwork {
  imageUrl: string;
  title: string;
  year: string;
  artist: string;
  medium: string;
  dimensions: string;
  description: string;
}

export interface Artist {
  slug: string;
  name: string;
  thumbnailUrl?: string;
}
