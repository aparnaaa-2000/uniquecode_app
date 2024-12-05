const mongoose = require("mongoose");




const dataSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  half: { type: String, required: true },
  halfValue: { type: Number, required: true },
  year: { type: Number, required: true },
  itemCode: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  uniqueCode: { type: String, required: true },
})

module.exports = mongoose.model("datas", dataSchema);
  