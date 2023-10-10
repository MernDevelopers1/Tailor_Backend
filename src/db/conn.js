const mongoose = require("mongoose");

async function connection(cd) {
  try {
    const connect = await mongoose.connect(
      "mongodb://127.0.1.1:27017/Tailor_App_Testing"
    );
    if (connect) {
      console.log("db connected successfully");
      cd();
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = { connection };
