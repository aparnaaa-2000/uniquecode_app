import { connect, Schema, model } from "mongoose";
connect('mongodb+srv://aparnarajendran:aparna@cluster0.2jjfvoh.mongodb.net/formData?retryWrites=true&w=majority')




const DataSchema = new Schema({
    category: String,
    subCategory: String,
    half: String,
    year: String,
    itemCode: String,
    size: String,
    quantity: Number,
    uniqueCode: { type: String, unique: true },
  });

  const DataModel = model("Data", DataSchema);
  export default DataModel;