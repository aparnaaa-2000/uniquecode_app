const mongoose = require('mongoose');

// Define your schema for the codes
const codeSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  half: { type: String, required: true },
  year: { type: Number, required: true },
  itemCode: { type: String, required: true },
  size: { type: Number, required: true },
  quantity: { type: Number, required: true },
  codes: { type: [String], required: true , unique: true } // Array of generated codes
});

const CodeData = mongoose.model('CodeData', codeSchema);

// Function to save data to MongoDB
async function saveDataToDatabase(data) {
  const newData = new CodeData(data);
  await newData.save(); // Save to the database
}

module.exports = { saveDataToDatabase };
