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

export default ApartmentCard;
