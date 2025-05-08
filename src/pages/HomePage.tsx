// src/pages/HomePage.tsx
import { Playlist, Track } from '../types/types';
import PlaylistCard from '../components/PlaylistCard';
import { Link } from 'react-router-dom';
import PlayerControls from '../components/PlayerControls';
import { useState } from 'react';

interface HomePageProps {
  playlists: Playlist[];
}

const HomePage = ({ playlists }: HomePageProps) =>{
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const handlePlayTrack = (track: Track) => {
        setCurrentTrack(track);
        // If you need to actually play audio, you'd add that here
      };

    return(
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Discover Your Next Favorite Songs</h1>
            <p className="text-xl text-gray-400">Select a playlist to get started</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-1 gap-5">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.name} playlist={playlist} onPlayTrack={handlePlayTrack}/>
            ))}
          </div>
          
          <div className="text-center pt-8">
              <Link
              to="/create-playlist"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
              Or Build Your Custom Playlist
              </Link>
          </div>
          <PlayerControls track={currentTrack} />
        </div>
      );
} 
    

export default HomePage;