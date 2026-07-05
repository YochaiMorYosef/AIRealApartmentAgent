import { pick } from "./pick";

export function normalizeApartment(item, index) {
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
