// src/pages/RecommendationsPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrackItem from '../components/TrackItem';
import PlayerControls from '../components/PlayerControls';
import { useApi } from '../hooks/useApi';
import { api } from '../api/client';
import { Track, Playlist } from '../types/types';
import { ApiRecommendationResponse } from '../api/client';


const RecommendationsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { callApi, loading, error } = useApi();
  
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [sourcePlaylist, setSourcePlaylist] = useState<Playlist | null>(null);
  const [draftPlaylist, setDraftPlaylist] = useState<Record<string, Track>>({});
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const hasFetched = useRef(false);

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  const loadRecommendations = (trackIds: string[], playlistName: string) => {
    callApi<ApiRecommendationResponse>(
      () => api.recommend(trackIds, playlistName),
      (responseData) => {
        // responseData is now guaranteed to have recommendations array
        setRecommendations(responseData.recommendations);
        setCurrentTrack(responseData.recommendations.pop() || null)
      }
    );
  };

  useEffect(() => {
    if (location.state?.playlist && !hasFetched.current) {
      hasFetched.current = true;
      setSourcePlaylist(location.state.playlist);
      const trackIds = Object.keys(location.state.playlist.tracks);
      loadRecommendations(trackIds, location.state.playlist.name);
    }
  }, [location]);
 // replacing this
  const addToDraft = (track: Track) => {
    setDraftPlaylist(prev => ({ ...prev, [track.track_id]: track }));
  };

  const removeFromDraft = (trackId: string) => {
    setDraftPlaylist(prev => {
      const newDraft = { ...prev };
      delete newDraft[trackId];
      return newDraft;
    });
  };
// with this


  const generateFromDraft = () => {
    if (Object.keys(draftPlaylist).length > 0) {
      const trackIds = Object.keys(draftPlaylist);
      loadRecommendations(trackIds, 'Custom Playlist');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {sourcePlaylist ? `Based on ${sourcePlaylist.name}` : 'Your Recommendations'}
        </h1>
        <button
          onClick={() => navigate('/create-playlist')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Start Over
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendation Results */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recommended Tracks</h2>
          {loading && <div className="text-center py-8">Loading recommendations...</div>}
          {error && <div className="text-red-400 p-4 bg-red-900/30 rounded-lg">{error}</div>}
          
          <div className="space-y-3">
            {recommendations.map(track => (
              <TrackItem
                key={track.track_id}
                track={track}
                mode="recommendation"
                onPlay={handlePlayTrack}
                onAdd={() => addToDraft(track)}
                isInDraft={draftPlaylist[track.track_id] !== undefined}
              />
            ))}
          </div>
        </div>

        {/* Draft Playlist */}
        <div className="space-y-4">
         

          {Object.keys(draftPlaylist).length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
              Add tracks from recommendations to build your custom playlist
            </div>
          ) : (
            <div className="space-y-3">
              {Object.values(draftPlaylist).map(track => (
                <TrackItem
                  key={track.track_id}
                  track={track}
                  mode="draft"
                  onRemove={() => removeFromDraft(track.track_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
        {/* Generate button */}
        <div className="flex flex-col items-end"> 
            <button
                onClick={generateFromDraft}
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

export default RecommendationsPage