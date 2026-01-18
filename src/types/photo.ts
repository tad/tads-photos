export interface Photo {
  id: string;
  src: string;
  filename: string;
  width: number;
  height: number;
}

export interface PhotosResponse {
  photos: Photo[];
  total: number;
}
