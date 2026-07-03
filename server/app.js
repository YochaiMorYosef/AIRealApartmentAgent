
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const geminiai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
console.log(process.env.GEMINI_API_KEY ? "✅ Gemini API Key Loaded" : "❌ Missing API Key");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { log } = require("console");
const { AsyncLocalStorage } = require("async_hooks");
const updateData = require("./updateData");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/apartments", (req, res) => {
    console.log(">>> api/apartments called <<<");
    
    const apartments = JSON.parse(
        fs.readFileSync("./apartments.json","utf8")
    );

    let results = apartments;

    if(req.query.city){

        results = results.filter(a =>
            a.city?.toLowerCase() === req.query.city.toLowerCase()
        );

    }
    console.log(results.length);
    
    res.json(results);

});

app.post("/api/update", async (req, res) => {
  try {
    const count = await updateData();

    res.json({
      success: true,
      message: "Apartments updated successfully.",
      apartments: count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update apartments.",
    });
  }
});

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

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Calling Gemini...");
    const response = await geminiai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {

        tools: [
          {
            functionDeclarations: [
              searchApartmentsTool
            ]
          }
        ]

      }
    });
    console.log("Gemini returned");
    const part = response.candidates[0].content.parts[0];

    if (part.functionCall) {
        const args = part.functionCall.args;
        const apartments = searchApartments(args);
        console.log(JSON.stringify(response, null, 2));
        
        let reply = "";
        if (apartments.length === 0) {

            reply = "לא מצאתי דירות שמתאימות לבקשה שלך.";

        } else {

            const first = apartments[0];

            reply =
                `מצאתי עבורך ${apartments.length} דירות.\n` +
                `הדירה הראשונה נמצאת ב${first.cityHebrew || first.city} ` +
                `במחיר ₪${first.price.toLocaleString()}.`;

        }

        return res.json({
            reply,
            apartments
        });
    }

    // console.log(response.text);
    // console.log(JSON.stringify(response, null, 2));
    return res.json({
      reply: response.text,
      apartments: []
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

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

app.listen(5000,()=>{
    console.log("Server running...");
});