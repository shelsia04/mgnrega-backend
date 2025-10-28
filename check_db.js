const mongoose = require('mongoose');
const District = require('./District');

mongoose.connect('mongodb+srv://shelsiarg04_db_user:V12AaoEeNSu2L73k@mgnrega-cluster.l1iu66r.mongodb.net/mgnregaDB')
  .then(async () => {
    const data = await District.find().limit(5);
    console.log("📦 Sample Data from MongoDB:\n", data);
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error connecting or fetching:", err);
    process.exit();
  });
