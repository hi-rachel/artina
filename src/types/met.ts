export interface Artist {
  slug: string;
  name: string;
  thumbnailUrl: string;
}

export interface Artwork {
  imageUrl: string;
  title: string;
  year: string;
  artist: string;
  medium: string;
  dimensions: string;
  description: string;
}

export interface MetApiResponse {
  objectIDs?: number[];
  objectID?: number;
  primaryImage?: string;
  title?: string;
  objectDate?: string;
  artistDisplayName?: string;
  medium?: string;
  dimensions?: string;
  creditLine?: string;
  objectDescription?: string;
  additionalImages?: string[];
  culture?: string;
  period?: string;
  dynasty?: string;
  reign?: string;
  isPublicDomain?: boolean | string;
  repository?: string;
  classification?: string;
  department?: string;
}
