export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photoCount?: number;
  photos?: Photo[];
  isLocked?: boolean;
}

export interface AlbumData {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photos?: Photo[];
  photoCount?: number;
  isLocked?: boolean;
  encryptedPhotos?: string;
}

export interface AlbumDataResponse {
  albums: AlbumData[];
}

export interface AlbumGalleryImage {
  src: string;
  name?: string;
  description?: string;
  caption?: string;
  url?: string;
  title?: string;
} 