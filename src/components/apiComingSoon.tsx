import { api } from "../api/client";

interface ApiComingSoonProps {
    apiUrl: string;
  }

const ApiComingSoon = ({ apiUrl }: ApiComingSoonProps) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">🎵 Music Loading...</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our music API is warming up. Check back soon!
        </p>
        <div className="text-sm text-gray-500 mt-2">
          API Endpoint: <code className="bg-gray-100 p-1 rounded">{apiUrl}</code>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  };

export default ApiComingSoon