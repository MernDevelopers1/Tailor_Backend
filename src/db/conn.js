const mongoose = require("mongoose");

async function connection(cd) {
  try {
    const connect = await mongoose.connect(process.env.db_url);
    if (connect) {
      console.log("db connected successfully");
      cd();
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = { connection };
