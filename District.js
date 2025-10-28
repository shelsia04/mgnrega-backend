const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
  district: { type: String, required: true },
  state: { type: String, required: true },
  total_households: { type: Number, default: 0 },
  work_days: { type: Number, default: 0 },
  wage_spent: { type: Number, default: 0 },
  month: { type: String, default: "Unknown" },
  last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("District", districtSchema);
