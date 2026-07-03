import { useEffect, useMemo, useState } from "react";

// The Apify yad2 scraper can return slightly different field names,
// so we look for a few common variants for each piece of data.
function pick(item, keys) {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
      return item[key];
    }
  }
  return null;
}

function normalizeApartment(item, index) {
  const image = pick(item, ["image", "coverImage", "imageUrl", "mainImage"]) ||
    (Array.isArray(item.images) && item.images[0]) ||
    null;

  return {
    id: item.id || item.token || index,
    image,
    price: pick(item, ["price", "priceText"]),
    city: pick(item, ["city", "cityText", "neighborhood"]),
    address: pick(item, ["address", "street", "fullAddress"]),
    rooms: pick(item, ["rooms", "roomsCount"]),
    size: pick(item, ["size", "squareMeters", "area"]),
    floor: pick(item, ["floor"]),
    description: pick(item, ["description", "text", "title"]),
  };
}

function ApartmentCard({ apartment }) {
  return (
    <div className="card">
      <div className="card-image">
        {apartment.image ? (
          <img src={apartment.image} alt={apartment.address || "דירה"} />
        ) : (
          <div className="card-image-placeholder">אין תמונה</div>
        )}
      </div>
      <div className="card-body">
        <div className="card-price">
          {apartment.price ? `₪${apartment.price}` : "מחיר לא צוין"}
        </div>
        <div className="card-location">
          {[apartment.city, apartment.address].filter(Boolean).join(" · ") || "מיקום לא צוין"}
        </div>
        <div className="card-details">
          {apartment.rooms && <span>{apartment.rooms} חדרים</span>}
          {apartment.size && <span>{apartment.size} מ״ר</span>}
          {apartment.floor && <span>קומה {apartment.floor}</span>}
        </div>
        {apartment.description && (
          <p className="card-description">{apartment.description}</p>
        )}
      </div>
    </div>
  );
}

function App() {
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

  return (
    <div className="app">
      <aside className="chat-panel">
        <h2>סוכן דירות</h2>
        <div className="chat-bubble">איזו דירה אתה מחפש?</div>
      </aside>

      <main className="dashboard">
        <div className="filters">
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="">כל הערים</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="מחיר מקסימלי"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {loading && <div className="status">טוען דירות...</div>}
        {error && <div className="status error">{error}</div>}
        {!loading && !error && filteredApartments.length === 0 && (
          <div className="status">לא נמצאו דירות</div>
        )}

        <div className="cards-grid">
          {filteredApartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
