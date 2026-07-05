const fs = require("fs");

function searchApartments(filters) {

    const apartments = JSON.parse(
        fs.readFileSync("./apartments.json", "utf8")
    );
    console.log("Filters:", filters);
    return apartments.filter((apt) => {

        // City (Hebrew + English)
        if (filters.city) {

            const city = filters.city.trim().toLowerCase();

            const cityMatch =
                apt.city?.toLowerCase() === city ||
                apt.cityHebrew?.toLowerCase().includes(city);

            if (!cityMatch)
                return false;
        }

        // Deal Type
        if (filters.dealType) {
            if (apt.dealType !== filters.dealType)
                return false;
        }

        // Rooms
        if (filters.minRooms) {
            if (apt.rooms < filters.minRooms)
                return false;
        }

        if (filters.maxRooms) {
            if (apt.rooms > filters.maxRooms)
                return false;
        }

        // Price
        if (filters.minPrice) {
            if (apt.price < filters.minPrice)
                return false;
        }

        if (filters.maxPrice) {
            if (apt.price > filters.maxPrice)
                return false;
        }

        // Parking
        if (filters.hasParking && !apt.hasParking)
            return false;

        // Balcony
        if (filters.hasBalcony && !apt.hasBalcony)
            return false;

        // Elevator
        if (filters.hasElevator && !apt.hasElevator)
            return false;

        // Safe Room
        if (filters.hasSecureRoom && !apt.hasSecureRoom)
            return false;

        return true;
    });

}

module.exports = {
    searchApartments
};