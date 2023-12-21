const mongoose = require("mongoose"),
  uri = process.env['MONGO_URI'];

const db = mongoose.connect(uri).then(() => {
  console.log("Connected to MongoDB");
})

module.exports = db;