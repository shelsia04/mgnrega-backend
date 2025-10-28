// insert_sample.js — Quick mock data insert
const mongoose = require("mongoose");
const District = require("./District");

mongoose
  .connect("mongodb+srv://shelsiarg04_db_user:V12AaoEeNSu2L73k@mgnrega-cluster.l1iu66r.mongodb.net/mgnregaDB")
  .then(async () => {
    console.log("✅ Connected to MongoDB for sample insert!");

    const sample = [
      { district: "NIWARI", state: "MADHYA PRADESH", total_households: 17219, work_days: 43, wage_spent: 1819.19, month: "Dec", last_updated: new Date() },
      { district: "RAIGAD", state: "MAHARASHTRA", total_households: 10276, work_days: 22, wage_spent: 655.40, month: "Dec", last_updated: new Date() },
      { district: "PUNE", state: "MAHARASHTRA", total_households: 15231, work_days: 30, wage_spent: 1423.24, month: "Dec", last_updated: new Date() },
      { district: "COIMBATORE", state: "TAMIL NADU", total_households: 18921, work_days: 37, wage_spent: 2310.55, month: "Dec", last_updated: new Date() },
    ];

    await District.deleteMany({});
    await District.insertMany(sample);
    console.log("💾 Sample districts inserted successfully!");

    process.exit();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
