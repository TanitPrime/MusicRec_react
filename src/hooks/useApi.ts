import { useState } from 'react';
import { ApiResponse } from '../types/types';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const callApi = async <T,>(
      apiCall: () => Promise<ApiResponse<T>>,
      onSuccess: (data: T) => void
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall();
        if (response.error) {
          throw new Error(response.error);
        }
        onSuccess(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    return { callApi, loading, error };
  };