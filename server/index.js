
const express = require("express");
const cors = require("cors");
require('./db/connect')
const generateUniqueCode = require('./utils/codeGenerator')

const User = require('./models/User')
const Data = require('./models/formData')

const app = express();


app.use(express.json());
app.use(cors());


app.post('/', async(req,res)=>{
  let user = new User (req.body);
  let result = await user.save();
  res.send(result);
})

app.post("/data", async (req, res) => {
    try {
      let { branchName,category, subCategory, half,halfValue, year, itemCode, size, quantity } = req.body;
      let uniqueCode = generateUniqueCode(branchName,subCategory, category, half,halfValue, year, itemCode, size, quantity);
  
      let newData = new Data({ branchName,category, subCategory, half,halfValue, year, itemCode, size, quantity, uniqueCode });
      await newData.save();
  
      res.status(201).json({ message: "Data saved successfully!", uniqueCode });
    } catch (error) {
      res.status(500).json({ error: "Error saving data" });
    }
  });




app.listen(3000, console.log("server starting at 3000"))
