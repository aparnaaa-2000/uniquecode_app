const express = require("express");
const cors = require("cors");
require('./db/connect');
const generateUniqueCode = require('./utils/codeGenerator');
const { saveDataToDatabase } = require('./models/formData'); // Ensure to import save function

const app = express();

app.use(express.json());
app.use(cors());

// POST endpoint to upload form data and save generated codes
app.post('/api/upload', async (req, res) => {
  const { branchName,category, subcategory, half, year, itemCode, size, quantity } = req.body;

  let codes = [];
  // Generate the specified number of unique codes
  for (let i = 0; i < quantity; i++) {
    const uniqueCode = generateUniqueCode(branchName, subcategory, category, half, year, itemCode, size);
    codes.push(uniqueCode);
  }

  // Save the data to MongoDB (including the codes)
  try {
    const newData = {
      branchName,
      category,
      subcategory,
      half,
      year,
      itemCode,
      size,
      quantity,
      codes
    };

    await saveDataToDatabase(newData); // Save to MongoDB
    res.status(201).json({ message: "Data saved successfully!", codes });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Error saving data" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
