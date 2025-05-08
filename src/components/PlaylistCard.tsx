// src/components/PlaylistCard.tsx
import { useState } from 'react';
import { Playlist , Track} from '../types/types';
import { Link } from 'react-router-dom';
import TrackItem from './TrackItem';

interface PlaylistCardProps {
  playlist: Playlist;
  onPlayTrack: (track: Track) => void;
}

const PlaylistCard = ({ playlist , onPlayTrack}: PlaylistCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sampleTracks = Object.values(playlist.tracks).slice(0, 4);

  return (
    <div className={`bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : ''}`}>
      <div 
        className="p-6 cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Album art collage */}
        <div className="h-40 grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden">
          
            <div className="col-span-2 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-4xl">🎵</span>
            </div>

        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{playlist.name}</h3>
            <p className="text-gray-400">{playlist.num_tracks} tracks</p>
          </div>
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <h4 className="text-lg font-semibold mb-3">Tracks in this playlist</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {Object.values(playlist.tracks).map((track) => (
              <TrackItem 
                key={track.track_id}
                track={track}
                onPlay={onPlayTrack}
                mode="search" 
                className="bg-gray-700/50 rounded p-2"
              />
            ))}
          </div>

          <div className="mt-4">
            <Link
              to="/recommendations"
              state={{ playlist }}
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              Get Recommendations
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistCard;