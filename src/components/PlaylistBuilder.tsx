// src/components/PlaylistBuilder.tsx
import { useState, useEffect } from 'react';
import TrackItem from './TrackItem';
import { api } from '../api/client';
import { Track, PaginatedTracks } from '../types/types';

interface PlaylistBuilderProps {
  onDraftUpdate: (tracks: Record<string, Track>) => void;
  currentDraft: Record<string, Track>;
  playlistName: string;             
  onNameChange: (name: string) => void;
  onPlayTrack: (track: Track) => void;
}

export const PlaylistBuilder = ({ onDraftUpdate, currentDraft, onNameChange, playlistName, onPlayTrack }: PlaylistBuilderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [spotifyAuth, setSpotifyAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 1
  });
  const [tracks, setTracks] = useState<Track[]>([]);

// Fetch all songs (paginated)
const fetchSongs = async (page: number, perPage: number) => {
    setIsLoading(true);
    try {
      const response = await api.getAllSongs(page, perPage);
      setTracks(response.data.tracks);
      setPagination({
        page: response.data.meta.page,
        perPage: response.data.meta.per_page,
        total: response.data.meta.total,
        totalPages: response.data.meta.total_pages
      });
    } finally {
      setIsLoading(false);
    }
  };

 // Handle per-page change
 const handlePageChange = (newPage: number) => {
    fetchSongs(newPage, pagination.perPage);
  };


  // Handle search
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      if (!searchTerm.trim()) {
        // When search is empty, show regular paginated results
        await fetchSongs(1, pagination.perPage);
        return;
      }
      
      // Call the search endpoint with the search term
      const response = await api.search(searchTerm, false); // false for spotifyAuth flag
      
      // Update tracks with search results
      console.log(response)
      setTracks(response.data);
      
      // Update pagination to show all search results at once
      setPagination(prev => ({
        ...prev,
        page: 1,
        perPage: response.data.length,
        total: response.data.length,
        totalPages: 1
      }));
      
    } catch (error) {
      console.error("Search failed:", error);
      // Optional: Add error state display here if needed
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination controls
  const handlePerPageChange = (newPerPage: number) => {
    fetchSongs(1, newPerPage); // Reset to first page
  };

  // Add/remove tracks from draft
  const addToDraft = (track: Track) => {
    onDraftUpdate({ ...currentDraft, [track.track_id]: track });
  };

  const removeFromDraft = (trackId: string) => {
    const newDraft = { ...currentDraft };
    delete newDraft[trackId];
    onDraftUpdate(newDraft);
  };

  // Load initial songs
  useEffect(() => {
    fetchSongs(currentPage, perPage);
  }, [currentPage, perPage]);

  return (
    <div className="space-y-6">
  {/* Search and Filter Controls */}
  <div className="flex gap-4 items-center">
    <input
        type="text"
        placeholder="Search songs..."
        className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Add this line
    />
    <button 
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        disabled={isLoading}
        >
        {isLoading ? (
            <div className="flex items-center gap-2">
            <span>Searching...</span>
            {/* Loading spinner */}
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
        ) : 'Search'}
    </button>
  </div>

  {/* Main Content Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column - Search Results */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Available Songs</h3>
      
      {/* Loading State */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: pagination.perPage }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg p-3 h-16"></div>
          ))}
        </div>
      )}

      {/* Results List */}
      {!isLoading && (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {tracks.map(track => (
            <TrackItem
              key={track.track_id}
              track={track}
              mode="search"
              onAdd={() => addToDraft(track)}
              onPlay={onPlayTrack}
              isInDraft={currentDraft[track.track_id] !== undefined}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        {/* Items Per Page Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show:</span>
          <select
            value={pagination.perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="bg-gray-800 rounded-lg px-3 py-1 text-sm"
          >
            {[10, 20, 50, 100].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 bg-gray-800 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {/* First Page */}
            <button
              onClick={() => handlePageChange(1)}
              className={`w-9 h-8 rounded-lg ${pagination.page === 1 ? 'bg-blue-600' : 'bg-gray-800'}`}
            >
              1
            </button>

            {/* Ellipsis or Second Page */}
            {pagination.page > 3 && <span className="px-1">...</span>}
            
            {/* Dynamic Middle Pages */}
            {[
              pagination.page - 1,
              pagination.page,
              pagination.page + 1
            ].filter(p => p > 1 && p < pagination.totalPages)
             .map(p => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-9 h-8 rounded-lg ${pagination.page === p ? 'bg-blue-600' : 'bg-gray-800'}`}
              >
                {p}
              </button>
            ))}

            {/* Ellipsis or Second-to-Last Page */}
            {pagination.page < pagination.totalPages - 2 && <span className="px-1">...</span>}

            {/* Last Page (if different from first) */}
            {pagination.totalPages > 1 && (
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                className={`w-9 h-8 rounded-lg ${pagination.page === pagination.totalPages ? 'bg-blue-600' : 'bg-gray-800'}`}
              >
                {pagination.totalPages}
              </button>
            )}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-1 bg-gray-800 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Total Count */}
        <div className="text-sm text-gray-400">
          {pagination.total} songs total
        </div>
      </div>
    </div>

    {/* Right Column - Draft Playlist */}
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Draft Playlist</h3>
        <span className="text-gray-400">
          {Object.keys(currentDraft).length} tracks
        </span>
      </div>
          {/* Playlist name */}
        <div className="mb-4">
            <label htmlFor="playlist-name" className="block text-sm font-medium text-gray-400 mb-1">
                Playlist Name
            </label>
            <input
                id="playlist-name"
                type="text"
                value={playlistName}
                onChange={(e) => onNameChange(e.target.value || 'Custom Playlist')}
                placeholder="Give your playlist a name"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
                The name influences recommendations - leave blank for default
            </p>
        </div>
      {Object.keys(currentDraft).length === 0 ? (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
          Add tracks from the left to build your playlist
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {Object.values(currentDraft).map(track => (
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
</div>
  );
};

export default PlaylistBuilder;