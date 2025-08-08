import { useState, useRef, useEffect } from "react";

type useFetchReturn<T> =
  | {
      data: null;
      isError: true;
      isLoading: boolean;
    }
  | {
      data: T;
      isError: false;
      isLoading: false;
    }
  | {
      data: T | null;
      isError: boolean;
      isLoading: true;
    }
  | {
      data: null;
      isError: false;
      isLoading: true;
    };

export const useFetch = <T>(url: string): useFetchReturn<T> => {
  const [state, setState] = useState<useFetchReturn<T>>({
    isError: false,
    isLoading: true,
    data: null,
  });
  const urlRef = useRef(url);

  useEffect(() => {
    urlRef.current = url;

    const fetchData = async () => {
      setState({
        data: state.data,
        isError: false,
        isLoading: true,
      });

      const data: Response = await fetch(url);

      if (urlRef.current !== url) {
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
    };

    fetchData();
  }, [url]);

  return state;
};
