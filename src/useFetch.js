import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = token;
        }

        const response = await fetch(url, {
          headers: headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [url]);

  return { data, error };
};

export default useFetch;
