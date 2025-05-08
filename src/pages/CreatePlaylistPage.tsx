// src/pages/CreatePlaylistPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaylistBuilder from '../components/PlaylistBuilder';
import { Track } from '../types/types';
import PlayerControls from '../components/PlayerControls';

const CreatePlaylistPage = () => {
  const navigate = useNavigate();
  const [draftPlaylist, setDraftPlaylist] = useState<Record<string, Track>>({});
  const [playlistName, setPlaylistName] = useState('Custom Playlist');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);


  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  const handleGenerateRecommendations = () => {
    
    if (Object.keys(draftPlaylist).length > 0 ) {
        if (Object.keys(draftPlaylist).length <6 ){
            alert("Please add at least 6 songs to generate recommendations");
            return;
        }
      navigate('/recommendations', {
        state: {
          playlist: {
            name: playlistName,
            num_tracks: Object.keys(draftPlaylist).length,
            tracks: draftPlaylist
          }
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Build Your Custom Playlist</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Back to Home
        </button>
        </div>

        <PlaylistBuilder 
            onDraftUpdate={setDraftPlaylist}
            currentDraft={draftPlaylist}
            playlistName= {playlistName}
            onPlayTrack={handlePlayTrack}
            onNameChange={setPlaylistName}
        />
        
        {/* Generate button */}
        <div className="flex flex-col items-end"> 
            <button
                onClick={handleGenerateRecommendations}
                disabled={Object.keys(draftPlaylist).length < 6} 
                className={`px-6 py-3 rounded-lg ${
                Object.keys(draftPlaylist).length < 6
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {Object.keys(draftPlaylist).length < 6
                ? `Add ${6 - Object.keys(draftPlaylist).length} more`
                : 'Generate Recommendations'}
            </button>
        
            {/* Warning message - will automatically disappear when >= 6 tracks */}
            {Object.keys(draftPlaylist).length > 0 && Object.keys(draftPlaylist).length < 6 && (
                <p className="mt-2 text-sm text-yellow-400 text-right"> {/* Added text-right */}
                Minimum 6 songs required for recommendations
                </p>
            )}
        </div>
        <PlayerControls track={currentTrack} />
    </div>
  );
};

export default CreatePlaylistPage;