import { useState, useEffect } from 'react';

export function useFirstLoad(delayMs = 900): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(t);
  }, []);
  return loading;
}
