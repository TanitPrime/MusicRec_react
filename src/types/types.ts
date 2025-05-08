export interface Track {
  artists: string;
  album_name: string;
  track_name: string;
  track_id: string;
  duration_ms?: number;
  preview_url?: string;
}

export interface Playlist {
  name: string;
  num_tracks: number;
  num_followers?: number;
  tracks: Record<string, Track>;
}

export type PlaylistCollection = Record<string, Playlist>;

export interface PaginatedResponse {
  tracks: Track[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export type ApiResponse<T> = {
  data: T;
  error?: string;
  status: number;
};
export interface PaginatedTracks {
  tracks: Track[];
  total: number;
  page: number;
  perPage: number;
}