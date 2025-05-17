import { useState, useEffect } from 'react';

const BASE_URL = 'https://conciertosback.onrender.com/conciertosBaraticos';

export function useFetchData(endpoint, initialData = []) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`);
      if (!response.ok) throw new Error('Error en la respuesta');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}