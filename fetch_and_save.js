const mongoose = require("mongoose");
const axios = require("axios");
const District = require("./District");

// ✅ MongoDB connection string
const MONGO_URI = "mongodb+srv://shelsiarg04_db_user:V12AaoEeNSu2L73k@mgnrega-cluster.l1iu66r.mongodb.net/mgnregaDB?retryWrites=true&w=majority";

// ✅ API details
const API_URL = "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const API_KEY = "579b464db66ec23bdd0000018812a00ca8f04815533f6ae8820ad372";

const fetchAndSave = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    console.log("🌐 Fetching data from API...");

    const response = await axios.get(API_URL, {
      params: {
        "api-key": API_KEY,
        format: "json",
        limit: 100,
        offset: 0,
        "filters[fin_year]": "2024-2025"
      },
    });

    const records = response.data.records || [];
    console.log(`📦 Received ${records.length} records from API`);

    if (records.length > 0) {
      // Clear old data
      await District.deleteMany({});

      // Map and save new data
      const formattedData = records.map((r) => ({
        district: r["district_name"] || r["District Name"] || "Unknown",
        state: r["state_name"] || r["State Name"] || "Unknown",
        total_households: Number(r["Total_Households_Worked"]) || 0,
        work_days: Number(r["Average_days_of_employment_provided_per_Household"]) || 0,
        month: r["month"] || r["Month"] || "Unknown",
        last_updated: new Date()
      }));

      await District.insertMany(formattedData);
      console.log("💾 Data saved successfully to MongoDB!");
    } else {
      console.log("⚠️ No records found in API response.");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Connection closed");
  }
};

fetchAndSave();
