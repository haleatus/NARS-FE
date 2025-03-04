import { useState, useEffect } from 'react';
import { loadGoogleMaps } from '@/core/utils/google-maps-loader';

export function useGoogleMaps(apiKey: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadGoogleMaps(apiKey)
      .then(() => setIsLoaded(true))
      .catch(err => setError(err));
  }, [apiKey]);

  return { isLoaded, error };
}