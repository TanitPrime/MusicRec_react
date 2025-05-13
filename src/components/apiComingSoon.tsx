import { useState } from "react";
import { useMusic } from "../MusicContext";


const ApiComingSoon = () => {
  const {apiUrl, setApiUrl} = useMusic()
  const [query, setQuery] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApiUrl(query)
  }

    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">🎵 Music Loading...</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our music API is warming up. Check back soon!
        </p>
       
        <form onSubmit={handleSubmit}>
          <div className="text-sm text-gray-500 mt-2">
          API Endpoint:
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={apiUrl}
            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search for tracks"
          />
          </div>
          <button 
            //onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry Connection
          </button>
        </form>
      </div>
      
    );
  };

export default ApiComingSoon