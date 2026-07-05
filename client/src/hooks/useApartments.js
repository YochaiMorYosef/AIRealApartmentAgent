import { useEffect, useMemo, useState } from "react";
import { normalizeApartment } from "../utils/normalizeApartment";

export function useApartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityFilter, setCityFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetch("/api/apartments")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setApartments(list.map(normalizeApartment));
        setLoading(false);
      })
      .catch(() => {
        setError("שגיאה בטעינת הדירות");
        setLoading(false);
      });
  }, []);

  const cities = useMemo(() => {
    const set = new Set(apartments.map((a) => a.city).filter(Boolean));
    return Array.from(set);
  }, [apartments]);

  const filteredApartments = useMemo(() => {
    return apartments.filter((a) => {
      const matchesCity = !cityFilter || a.city === cityFilter;
      const matchesPrice = !maxPrice || (a.price && Number(a.price) <= Number(maxPrice));
      return matchesCity && matchesPrice;
    });
  }, [apartments, cityFilter, maxPrice]);

  return {
    apartments,
    setApartments,
    loading,
    error,
    cityFilter,
    setCityFilter,
    maxPrice,
    setMaxPrice,
    cities,
    filteredApartments
  };
}
