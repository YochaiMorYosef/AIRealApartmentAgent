import ApartmentCard from "./ApartmentCard";

function Dashboard({
  cities,
  cityFilter,
  onCityFilterChange,
  maxPrice,
  onMaxPriceChange,
  loading,
  error,
  filteredApartments
}) {
  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1>לוח דירות</h1>
        <span className="dashboard-count">{filteredApartments.length} דירות</span>
      </div>

      <div className="filters">
        <select value={cityFilter} onChange={(e) => onCityFilterChange(e.target.value)}>
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
          onChange={(e) => onMaxPriceChange(e.target.value)}
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
  );
}

export default Dashboard;
