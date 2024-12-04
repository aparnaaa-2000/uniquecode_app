const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());


const cors = require("cors");
app.use(cors());


// MongoDB Connection
// mongoose.connect("mongodb+srv://aparnarajendran:aparna@cluster0.2jjfvoh.mongodb.net/newproject?retryWrites=true&w=majority", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("MongoDB connected");
// });


const generateUniqueCode = (data) => {
    const { subCategory, category, half, year, itemCode, size } = data;
  
    // Base Code Format
    let code = `${subCategory[0]}${category[0]}${half}${year}${itemCode}${size}`;
    
    // Append 6-character alphanumeric code
    const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    
    return code + randomCode;
  };


  app.post("/upload", async (req, res) => {
    const records = req.body;
  
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    }
  
    try {
      // Process records in batches
      const batchSize = 10000;
      let allData = [];
  
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize).map((record) => ({
          ...record,
          uniqueCode: generateUniqueCode(record),
        }));
        allData.push(...batch);
      }
  
      // Bulk insert into MongoDB
      await DataModel.insertMany(allData);
  
      res.status(201).json({ message: "Data uploaded successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing data" });
    }
  });

 
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
  
  
  