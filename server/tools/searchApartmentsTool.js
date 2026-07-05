const searchApartmentsTool = {
  name: "searchApartments",
  description: "Search apartments for sale or rent. \
                If the user says: \
                לקנייה \
                למכירה \
                Return: \
                dealType = sale  \
                If the user says:  \
                להשכרה  \
                לשכור  \
                \
                Return: \
                dealType = rent \
                \
                If the user doesn't specify, ask the user whether they are looking to buy or rent instead of assuming.",
  
  parameters: {
    type: "OBJECT",
    properties: {

      city: {
        type: "STRING",
        description: "City name in Hebrew exactly as users say it. Example: תל אביב, ירושלים, חיפה."
      },

      neighbourhood: {
        type: "STRING",
        description: "Neighborhood"
      },

      dealType: {
        type: "STRING",
        enum: ["sale", "rent"],
        description: "Apartment for sale or rent"
      },

      minPrice: {
        type: "NUMBER"
      },

      maxPrice: {
        type: "NUMBER"
      },

      minRooms: {
        type: "NUMBER"
      },

      maxRooms: {
        type: "NUMBER"
      },

      hasParking: {
        type: "BOOLEAN"
      },

      hasBalcony: {
        type: "BOOLEAN"
      },

      hasElevator: {
        type: "BOOLEAN"
      },

      hasSecureRoom: {
        type: "BOOLEAN"
      },

      minArea: {
        type: "NUMBER"
      },

      maxArea: {
        type: "NUMBER"
      }

    }
  }
};

module.exports = searchApartmentsTool;