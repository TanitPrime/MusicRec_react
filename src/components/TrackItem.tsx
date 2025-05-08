// src/components/TrackItem.tsx
import { Track } from '../types/types';

interface TrackItemProps {
  track: Track;
  mode: 'draft' | 'recommendation' | 'search' | 'display';
  onAdd?: () => void;
  onRemove?: () => void;
  onPlay?: (track: Track) => void;
  isInDraft?: boolean;
  className?: string;
}

const TrackItem = ({ 
  track, 
  mode, 
  onAdd, 
  onRemove, 
  onPlay,
  isInDraft = false,
  className = '' 
}: TrackItemProps) => {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${className} ${
      mode === 'search' && isInDraft ? 'bg-gray-800/50' : 'bg-gray-800'
    }`}>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{track.track_name}</h4>
        <p className="text-sm text-gray-400 truncate">
          {track.artists} • {track.album_name}
        </p>
      </div>
      {/* Play Button */}
      <button 
        onClick={() => onPlay?.(track)}
        className="text-gray-400 hover:text-white flex-shrink-0"
        aria-label="Play track"
        >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        </button>
      {/* Action buttons based on mode */}
      {mode === 'draft' && onRemove && (
        <button
          onClick={onRemove}
          className="ml-4 text-red-400 hover:text-red-300 p-2"
          aria-label="Remove track"
        >
          Remove
        </button>
      )}
      
      {mode === 'recommendation' && onAdd && (
        <button
          onClick={onAdd}
          disabled={isInDraft}
          className={`ml-4 p-2 rounded ${
            isInDraft 
              ? 'text-gray-500 cursor-default' 
              : 'text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-900/30'
          }`}
          aria-label={isInDraft ? "Already in playlist" : "Add to playlist"}
        >
            {isInDraft ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            ) : (
                '+ Add'
            )}        
        </button>
      )}
      
      {mode === 'search' && onAdd && (
        <button
          onClick={onAdd}
          disabled={isInDraft}
          className={`ml-4 p-2 rounded ${
            isInDraft 
              ? 'text-gray-500 cursor-default' 
              : 'text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-900/30'
          }`}
          aria-label={isInDraft ? "Already in playlist" : "Add to playlist"}
        >
          {isInDraft ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            '+ Add'
          )}
        </button>
      )}
    </div>
  );
};

export default TrackItem;