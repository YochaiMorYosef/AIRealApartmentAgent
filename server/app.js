
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const apartmentRoutes = require("./routes/apartments");
const chatRoutes = require("./routes/chat");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", apartmentRoutes);
app.use("/api", chatRoutes);

app.listen(5000,()=>{
    console.log("Server running...");
});