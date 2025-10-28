const mongoose = require('mongoose');
const District = require('./District');

const connectAndCheck = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://shelsiarg04_db_user:V12AaoEeNSu2L73k@mgnrega-cluster.l1iu66r.mongodb.net/mgnregaDB?retryWrites=true&w=majority'
    );
    console.log('✅ Connected to MongoDB');

    const districts = await District.find();
    console.log('📊 Total districts found:', districts.length);

    if (districts.length > 0) {
      console.log(districts.slice(0, 5)); // show first 5 for preview
    } else {
      console.log('⚠️ No records found in collection.');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Connection closed');
  }
};

connectAndCheck();
