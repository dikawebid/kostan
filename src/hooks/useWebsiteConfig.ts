import { useState, useEffect } from 'react';
import { WebsiteConfig } from '../types';
import { getWebsiteConfig } from '../services/configService';

interface UseWebsiteConfigReturn {
  config: WebsiteConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWebsiteConfig = (): UseWebsiteConfigReturn => {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedConfig = await getWebsiteConfig();
      setConfig(fetchedConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch website configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    refetch: fetchConfig
  };
};