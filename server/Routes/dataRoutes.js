// const express = require("express");
// const Data = require("../models/formData");
// const generateUniqueCode = require("../utils/codeGenerator");
// const dotenv = require("dotenv");
// const router = express.Router();

// // router.post("/", async (req, res) => {
// //     try {
// //       const { branchName,category, subCategory, half,halfValue, year, itemCode, size, quantity } = req.body;
// //       const uniqueCode = generateUniqueCode(branchName,subCategory, category, half,halfValue, year, itemCode, size);
  
// //       const newData = new Data({ branchName,category, subCategory, half,halfValue, year, itemCode, size, quantity, uniqueCode });
// //       await newData.save();
  
// //       res.status(201).json({ message: "Data saved successfully!", uniqueCode });
// //     } catch (error) {
// //       res.status(500).json({ error: "Error saving data" });
// //     }
// //   });

// router.post("/", async(req,res)=>{
//     let data = new Data (req.body);
//     let result = await user.save();
//     res.send(result); 
// })

// // router.get("/data", async (req, res) => {
// //   try {
// //     const data = await Data.find();
// //     res.status(200).json(data);
// //   } catch (error) {
// //     res.status(500).json({ error: "Error fetching data" });
// //   }
// // });

// module.exports = router;
