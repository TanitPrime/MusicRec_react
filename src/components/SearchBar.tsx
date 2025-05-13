import React, { useState } from 'react';
import { useMusic } from '../MusicContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const { performSearch } = useMusic();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
      //setActiveTab('search'); // Switch to search tab when searching
    }
  };
  
  return (
    <div className="bg-white p-4 shadow-md mb-4 sticky top-0 z-10">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for tracks..."
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search for tracks"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;