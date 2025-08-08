import { useState, useRef, useEffect, useCallback } from "react";
import type { DistributiveOmit } from "../entity/typeHelpers";

type useFetchReturn<T> = {
  refetch: () => Promise<void>;
} & (
  | {
      data: null;
      isError: true;
      isLoading: false;
    }
  | {
      data: T;
      isError: false;
      isLoading: false;
    }
  | {
      data: T | null;
      isError: false;
      isLoading: true;
    }
  | {
      data: null;
      isError: false;
      isLoading: true;
    }
);

export const useFetch = <T>(url: string): useFetchReturn<T> => {
  const [state, setState] = useState<
    DistributiveOmit<useFetchReturn<T>, "refetch">
  >({
    isError: false,
    isLoading: true,
    data: null,
  });
  const abortControllerRef = useRef<null | AbortController>(null);
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort("Old request");
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setState((prev) => ({
      data: prev.data,
      isError: false,
      isLoading: true,
    }));

    try {
      const data: Response = await fetch(url, {
        signal: abortController.signal,
      });

      if (fetchId !== fetchIdRef.current) {
        return;
      }

      if (!data.ok) {
        setState({
          data: null,
          isError: true,
          isLoading: false,
        });

        return;
      }

      const parsedData: T = await data.json();

      setState({
        data: parsedData,
        isError: false,
        isLoading: false,
      });
    } catch (err) {
      console.error(err);
    }
  }, [url]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort("Dismount");
    };
  }, [url]);

  return { ...state, refetch };
};
