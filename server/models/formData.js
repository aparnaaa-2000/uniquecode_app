const mongoose = require('mongoose');

// Schema definition
const codeSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  half: { type: String, required: true },
  year: { type: Number, required: true },
  itemCode: { type: String, required: true },
  size: { type: Number, required: true },
  quantity: { type: Number, required: true },
  codes: { type: [String], required: true }, // Array of generated codes
});

// Create and export the Mongoose model
const CodeData = mongoose.model('CodeData', codeSchema);
module.exports = CodeData;
