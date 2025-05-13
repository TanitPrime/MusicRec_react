// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ApiComingSoon from './components/apiComingSoon';
import { MusicProvider } from './MusicContext';
import { useMusic } from './MusicContext';
import PlayerControls from './components/PlayerControls';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import RecommendationsPage from './pages/RecommendationsPage';


const App = () => {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const {apiUrl, setApiUrl} = useMusic()

  const checkApiHealth = async (url: string) => {
    console.log("Starting health check with URL:", url);
    try {
      console.log("Making request to:", `${url}/health`);
      const startTime = Date.now();
      
      const response = await fetch(`${url}/health`, {
        mode: "cors",
        method: "GET",  
      });
      
      console.log(`Request completed in ${Date.now() - startTime}ms`);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API not healthy: ${response.status} ${errorData}`);
      }
      
      setApiAvailable(true);
      return true;
    } catch (error) {
      console.error("Full error details:", error);
      setApiAvailable(false);
      return false;
    }
  };
  useEffect(() => {
    if (apiUrl) {
      const verifyApi = async () => {
        const isHealthy = await checkApiHealth(apiUrl);

        if (isHealthy) {
            console.log(apiUrl)
            setApiUrl(apiUrl);
        }

      };

      verifyApi();
    }
  }, [apiUrl]);
  

  if (!apiAvailable) {
    return <ApiComingSoon/>;
  }

  return (
    <MusicProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-6 mb-24">
            {!apiAvailable ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-bold mb-4">API Connection Failed</h2>
                <p>Unable to connect to the music API. Please check your connection and try again.</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-playlist" element={<CreatePlaylistPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
              </Routes>
            )}
          </main>
          
          {/* Fixed position player at the bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-10">
            <PlayerControls />
          </div>
        </div>
      </Router>
    </MusicProvider>
  );
}
export default App;