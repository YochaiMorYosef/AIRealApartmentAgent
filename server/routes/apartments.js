const express = require("express");
const router = express.Router();

const fs = require("fs");
const updateData = require("../updateData");

router.get("/apartments", (req, res) => {
    console.log(">>> Route: api/apartments called <<<");
    
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

// POST Route for updating data apartments
router.post("/update", async (req, res) => {
    console.log(">>> Route: api/update called <<<");
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

module.exports = router;