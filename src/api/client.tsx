import { ApiResponse, Track, PaginatedResponse } from '../types/types';

interface ApiClient {
  recommend: (ids: string[], name: string) => Promise<any>;
  search: (searchTerm: string, spotify_connection: boolean) => Promise<any>;
  getAllSongs: (page: number, per_page: number) => Promise<any>;
  getSongsById:  (ids: string[])=> Promise<any>
}
  
export const createApiClient = (apiUrl: string): ApiClient   => {
  
  return{
    recommend: async (ids: string[], name: string): Promise<ApiResponse<ApiClient>> => {
        const response = await fetch(`${apiUrl}/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "ids":ids, "name":name })
        });
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Directly return the response as it matches our interface
        return {
          data: data,  // Your API already returns { recommendations: [...] }
          status: response.status,
          error: undefined
        };
      },

    search: async (searchTerm: string, spotifyAuth: boolean = false): Promise<ApiResponse<Track[]>> => {
        const response = await fetch(`${apiUrl}/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "term":searchTerm, "spotify_connection":spotifyAuth })
          })
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          const data = await response.json();

          return {
            data: data,  // Your API already returns { recommendations: [...] }
            status: response.status,
            error: undefined
          };
    },

    getAllSongs: async (page: number = 1, perPage: number = 20): Promise<ApiResponse<PaginatedResponse>> => {
        const response = await fetch(`${apiUrl}/all-songs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "page":page,
            "per_page": perPage
          })
        });
        const data = await response.json();
        // Directly return the response as it matches our interface
        return {
            data: data,  // Your API already returns { recommendations: [...] }
            status: response.status,
            error: undefined
            };
      },

    getSongsById: async (ids: string[]): Promise<ApiResponse<Record<string, Track>>> => {
        const response = await fetch(`${apiUrl}/get_songs_by_id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_ids: ids })
        });
        return response.json();
    }
  }
};