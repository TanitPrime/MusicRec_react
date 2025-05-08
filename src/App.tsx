// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ApiComingSoon from './components/apiComingSoon';
import RecommendationsPage from './pages/RecommendationsPage';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import { Playlist, Track } from './types/types';

// Import the JSON data
import topPlaylistsData from './assets/top_playlists.json';

// Define the exact JSON structure we're importing
interface RawPlaylistData {
  [playlistId: string]: {
    name: string;
    num_tracks: number;
    num_followers?: number;
    tracks: {
      [trackId: string]: {
        artists: string;
        album_name: string;
        track_name: string;
      };
    };
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const App = () => {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [preloadedPlaylists, setPreloadedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Check Api health first
    const checkApi = async () => {
      try {
        const response = await fetch(`${API_URL}/health`); // Replace with a real endpoint
        setApiAvailable(response.ok);
      } catch (error) {
        setApiAvailable(false);
      }
    };

    checkApi();
    // Transform the raw JSON data into our app's format
    const transformPlaylistData = (data: RawPlaylistData): Playlist[] => {
      return Object.values(data).map(playlist => ({
        name: playlist.name,
        num_tracks: playlist.num_tracks,
        tracks: Object.entries(playlist.tracks).reduce((acc, [trackId, track]) => {
          acc[trackId] = {
            ...track,
            track_id: trackId // Ensure track_id is included
          };
          return acc;
        }, {} as Record<string, Track>)
      }));
    };

    try {
      const transformedPlaylists = transformPlaylistData(topPlaylistsData);
      setPreloadedPlaylists(transformedPlaylists);
      setLoading(false);
    } catch (error) {
      console.error('Error transforming playlist data:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-2xl">Loading playlists...</div>
      </div>
    );
  }

  // Show "Coming Soon" if API is down
  if (!apiAvailable) {
    return <ApiComingSoon apiUrl={API_URL} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Header />
        
        <main className="flex-4 p-4">
          <Routes>
            <Route path="/" element={
              <HomePage playlists={preloadedPlaylists} />
            } />
            <Route path="/create-playlist" element={
              <CreatePlaylistPage />} />
            <Route path="/recommendations" element={
              <RecommendationsPage />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;