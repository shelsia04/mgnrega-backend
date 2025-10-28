const axios = require("axios");

const API_URL =
  "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const API_KEY =
  "579b464db66ec23bdd0000018812a00ca8f04815533f6ae8820ad372";

(async () => {
  try {
    const res = await axios.get(API_URL, {
      params: {
        "api-key": API_KEY,
        format: "json",
        limit: 3, // just 3 records
      },
    });
    console.log("👉 First record:\n", res.data.records[0]);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
