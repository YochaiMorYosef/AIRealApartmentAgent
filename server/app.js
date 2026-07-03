// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());

// // Fetches apartment listings from Apify and returns them to the frontend.
// // The frontend never talks to Apify directly - only this server does.
// app.get("/api/apartments", async (req, res) => {
//   try {
//     const token = process.env.APIFY_TOKEN;
//     console.log("token: ", token);
    
//     const body = {
//         city: req.query.city || "Tel Aviv",
//         maxItems: 24,
//         enrichListings: true,
//         requireBalcony: false,
//         requireElevator: false,
//         requireParking: false,
//         requireSecureRoom: false
//     };
//     const url = ` https://api.apify.com/v2/acts/swerve~yad2-scraper/run-sync-get-dataset-items?token=${token}`;

//     // const apifyResponse = await fetch(url);
//     const apifyResponse = await fetch(url,{
//         method:"POST",
//         headers:{
//             "Content-Type":"application/json"
//         },
//         body:JSON.stringify(body)
//     });

//     console.log(apifyResponse);
    
//     if (!apifyResponse.ok) {
//       throw new Error(`Apify request failed with status ${apifyResponse.status}`);
//     }

//     const apartments = await apifyResponse.json();
//     res.json(apartments);
//   } catch (error) {
//     console.error("Failed to fetch apartments:", error.message);
//     res.status(500).json({ error: "Failed to fetch apartments" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { log } = require("console");
const { AsyncLocalStorage } = require("async_hooks");
const updateData = require("./updateData");

const app = express();

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

app.listen(5000,()=>{
    console.log("Server running...");
});