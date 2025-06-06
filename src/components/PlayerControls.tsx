import { useMusic } from '../MusicContext';



const PlayerControls = () => {
    const { currentTrack } = useMusic();
    if (!currentTrack) return null;
  
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-3">
            {/* Spotify Embed */}
            <iframe
              src={`https://open.spotify.com/embed/track/${currentTrack.track_id}`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
              className="rounded-lg"
            />
          </div>
        </div>
      );
  };
export default PlayerControls