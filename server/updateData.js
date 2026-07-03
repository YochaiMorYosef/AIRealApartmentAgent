require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function updateData() {
  const token = process.env.APIFY_TOKEN;

  const url = `https://api.apify.com/v2/acts/swerve~yad2-scraper/run-sync-get-dataset-items?token=${token}`;

  const body = {
    city: "Tel Aviv",
    maxItems: 24,
    enrichListings: true,
    requireBalcony: false,
    requireElevator: false,
    requireParking: false,
    requireSecureRoom: false,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Apify request failed: ${response.status}`);
  }

  const apartments = await response.json();

  fs.writeFileSync(
    path.join(__dirname, "apartments.json"),
    JSON.stringify(apartments, null, 2)
  );

  return apartments.length;
}

module.exports = updateData;

// Run from terminal
if (require.main === module) {
  updateData()
    .then((count) => console.log(`✅ Saved ${count} apartments`))
    .catch(console.error);
}