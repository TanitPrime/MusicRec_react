import { ApiResponse, Track, PaginatedResponse } from '../types/types';
export interface ApiRecommendationResponse {
    recommendations: Track[];
  }
  

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const api = {
    recommend: async (ids: string[], name: string): Promise<ApiResponse<ApiRecommendationResponse>> => {
        console.log(ids)
        console.log(name)
        const response = await fetch(`${API_BASE}/recommend`, {
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
        const response = await fetch(`${API_BASE}/search`, {
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
        const response = await fetch(`${API_BASE}/all-songs`, {
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
        const response = await fetch(`${API_BASE}/get_songs_by_id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_ids: ids })
        });
        return response.json();
    }
};