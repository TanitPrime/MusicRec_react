import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import preloadedPlaylists from './assets/preloaded_playlists.json';
import { Track, Playlist } from './types/types';
import { createApiClient} from './api/client';

interface MusicContextProps {
  // Current playing track
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  
  // Draft playlist
  draftPlaylist: {
    tracks: Track[];
    name: string;
  };
  addToDraft: (track: Track) => void;
  removeFromDraft: (trackId: string) => void;
  clearDraft: () => void;
  setDraftName: (name: string) => void;
  
  // Browsing
  allSongs: Track[];
  currentPage: number;
  totalPages: number;
  isLoadingAllSongs: boolean;
  fetchAllSongsPage: (page: number) => void;
  
  // Search
  searchResults: Track[];
  searchTerm: string;
  isSearching: boolean;
  performSearch: (term: string) => void;
  
  // Recommendations
  recommendationResults: Track[];
  isGeneratingRecommendations: boolean;
  generateRecommendations: () => void;
  
  // Playlists
  playlists: Playlist[];
  loadPlaylists: () => void;

  //url stuff
  apiUrl: string;
  setApiUrl: (url: string) => void;
  updateApiUrl: (url: string) =>void;
}

const MusicContext = createContext<MusicContextProps | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {


  //Api url state
  const [apiUrl, setApiUrl] = useState<string>(
    localStorage.getItem('apiUrl') || 'http://localhost:5000' // Proper default
  );
  
  // Persist when set
  const updateApiUrl = (url: string) => {
    localStorage.setItem('apiUrl', url);
    setApiUrl(url);
  };  const api = createApiClient(apiUrl);
  // Current track state for player
  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => {
    const saved = localStorage.getItem('currentTrack');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Draft playlist state
  const [draftPlaylist, setDraftPlaylist] = useState<{
    tracks: Track[];
    name: string;
  }>(() => {
    const saved = localStorage.getItem('draftPlaylist');
    return saved ? JSON.parse(saved) : { tracks: [], name: 'New Playlist' };
  });
  
  // Browse state
  const [allSongs, setAllSongs] = useState<Track[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingAllSongs, setIsLoadingAllSongs] = useState<boolean>(false);
  
  // Search state
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Recommendations state
  const [recommendationResults, setRecommendationResults] = useState<Track[]>(() => {
    const saved = localStorage.getItem('recommendationResults');
    return saved ? JSON.parse(saved) : [];
  });
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState<boolean>(false);
  
  // Playlists state
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  // Save states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('currentTrack', JSON.stringify(currentTrack));
  }, [currentTrack]);
  
  useEffect(() => {
    localStorage.setItem('draftPlaylist', JSON.stringify(draftPlaylist));
  }, [draftPlaylist]);
  
  useEffect(() => {
    localStorage.setItem('recommendationResults', JSON.stringify(recommendationResults));
  }, [recommendationResults]);

  useEffect(() => {
    console.log('API URL changed to:', apiUrl);
  }, [apiUrl]);
  
  // Methods for draft playlist
  const addToDraft = (track: Track) => {
    setDraftPlaylist(prev => {
      // Check if track already exists in draft
      if (prev.tracks.some(t => t.track_id === track.track_id)) {
        return prev;
      }
      return {
        ...prev,
        tracks: [...prev.tracks, track]
      };
    });
  };
  
  const removeFromDraft = (trackId: string) => {
    setDraftPlaylist(prev => ({
      ...prev,
      tracks: prev.tracks.filter(t => t.track_id !== trackId)
    }));
  };
  
  const clearDraft = () => {
    setDraftPlaylist({
      tracks: [],
      name: 'New Playlist'
    });
  };
  
  const setDraftName = (name: string) => {
    setDraftPlaylist(prev => ({
      ...prev,
      name
    }));
  };

  
  // Method to fetch all songs
  const fetchAllSongsPage = async (page: number, per_page:number = 20) => {
    setIsLoadingAllSongs(true);
    try {
      const response = await api.getAllSongs(page, per_page);
      setAllSongs(response.data.tracks);
      setTotalPages(response.data.meta.total_pages);
      setCurrentPage(response.data.meta.page);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setIsLoadingAllSongs(false);
    }
  };
  
  // Method to search songs
  const performSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await api.search(term, false);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching songs:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Method to generate recommendations
  const generateRecommendations = async () => {
    if (draftPlaylist.tracks.length < 6) {
      alert('You need at least 6 tracks in your draft to generate recommendations');
      return;
    }
    
    setIsGeneratingRecommendations(true);
    try {
      const trackIds = draftPlaylist.tracks.map(track => track.track_id);
      const response = await api.recommend(trackIds, draftPlaylist.name);
      setRecommendationResults(response.data.recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };
  
  // Method to load playlists from local file
  const loadPlaylists = async () => {
    try {
      const transformedPlaylists: Playlist[] = preloadedPlaylists.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        num_tracks: playlist.num_tracks,
        tracks: playlist.tracks.map((track: any) => ({
          track_id: track.id,
          track_name: track.track_name,
          artists: track.artists,
          album_name: track.album_name
        }))
      }));
      setPlaylists(transformedPlaylists)
      console.log('Loading playlists...');
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };
  
  const value = {
    currentTrack,
    setCurrentTrack,
    draftPlaylist,
    addToDraft,
    removeFromDraft,
    clearDraft,
    setDraftName,
    allSongs,
    currentPage,
    totalPages,
    isLoadingAllSongs,
    fetchAllSongsPage,
    searchResults,
    searchTerm,
    isSearching,
    performSearch,
    recommendationResults,
    isGeneratingRecommendations,
    generateRecommendations,
    playlists,
    loadPlaylists,
    apiUrl,
    setApiUrl,
    updateApiUrl
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};