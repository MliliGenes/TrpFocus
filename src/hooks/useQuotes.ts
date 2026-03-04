import { useState, useEffect, useCallback } from 'react';

interface Quote {
  id: number;
  quote: string;
  author: string;
}

export const useQuotes = (intervalMinutes: number = 10) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://dummyjson.com/quotes/random');
      const data = await res.json();
      setQuote(data);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, intervalMinutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchQuote, intervalMinutes]);

  return { quote, loading, refresh: fetchQuote };
};
