// ✅ server.js — FINAL FIXED VERSION (CORS enabled for Vercel frontend)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");
const District = require("./District");

const app = express();

// ✅ CORS CONFIG — allow frontend (vercel) + local dev
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local dev
      "https://mgnrega-frontend-app.vercel.app", // vercel frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://shelsiarg04_db_user:V12AaoEeNSu2L73k@mgnrega-cluster.l1iu66r.mongodb.net/mgnregaDB?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Details
const API_URL =
  "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const API_KEY =
  process.env.API_KEY ||
  "579b464db66ec23bdd0000018812a00ca8f04815533f6ae8820ad372";

// ✅ Fetch & Cache Data
const fetchAndCacheData = async () => {
  try {
    console.log("🌐 Fetching data from MGNREGA API...");
    const response = await axios.get(API_URL, {
      params: {
        "api-key": API_KEY,
        format: "json",
        limit: 100,
      },
    });

    const records = response.data.records || [];
    console.log(`📦 Fetched ${records.length} records`);

    if (records.length === 0) {
      console.warn("⚠️ No records found from API.");
      return;
    }

    await District.deleteMany({});

    const mappedData = records.map((r) => ({
      district: (
        r["district_name"] ||
        r["District Name"] ||
        r["district"] ||
        "Unknown"
      )
        .trim()
        .toUpperCase(),
      state: (
        r["state_name"] ||
        r["State Name"] ||
        r["state"] ||
        "Unknown"
      )
        .trim()
        .toUpperCase(),
      total_households:
        parseInt(
          r["Total_Households_Worked"] ||
            r["no_of_households_worked"] ||
            0
        ) || 0,
      work_days:
        parseInt(
          r["Average_days_of_employment_provided_per_Household"] ||
            r["average_days_of_employment_provided_per_household"] ||
            0
        ) || 0,
      wage_spent: parseFloat(r["Wages"] || 0) || 0,
      month: r["month"] || "Unknown",
      last_updated: new Date(),
    }));

    await District.insertMany(mappedData);
    console.log("💾 Data successfully refreshed in MongoDB!");
  } catch (err) {
    console.error("❌ Error fetching data from API:", err.message);
  }
};

// ✅ Run Once at Startup
fetchAndCacheData();

// ✅ Daily Refresh at Midnight
cron.schedule("0 0 * * *", async () => {
  console.log("🔁 Running daily refresh...");
  await fetchAndCacheData();
  console.log("✅ Daily refresh done.");
});

// ✅ ROUTES
app.get("/", (req, res) => {
  res.send("💛 MGNREGA Backend is running successfully!");
});

// ✅ Get all districts
app.get("/api/districts", async (req, res) => {
  try {
    const data = await District.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// ✅ Get district by name (case-insensitive)
app.get("/api/districts/:name", async (req, res) => {
  try {
    const districtName = req.params.name;
    const escapedName = districtName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const districtData = await District.findOne({
      district: { $regex: new RegExp(`^${escapedName}$`, "i") },
    });

    if (!districtData) {
      return res.status(404).json({ message: "District not found" });
    }

    res.json(districtData);
  } catch (err) {
    console.error("❌ Error fetching district:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Check MongoDB Connection
if (mongoose.connection.readyState !== 1) {
  console.error("⚠️ MongoDB not connected yet.");
}

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
