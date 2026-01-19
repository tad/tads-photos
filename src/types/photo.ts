export interface Photo {
  id: string;
  src: string;
  filename: string;
  width: number;
  height: number;
  uploadedAt?: string;
}

export interface PhotosResponse {
  photos: Photo[];
  total: number;
}
