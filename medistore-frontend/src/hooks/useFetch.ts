// ============================================================
// useFetch – generic data-fetching hook with loading/error state
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): FetchState<T> {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const countRef              = useRef(0);

  const run = useCallback(async () => {
    const count = ++countRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (count === countRef.current) setData(result);
    } catch (err: unknown) {
      if (count === countRef.current) {
        const msg =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Something went wrong"
            : "Something went wrong";
        setError(msg);
      }
    } finally {
      if (count === countRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run };
}

export default useFetch;
