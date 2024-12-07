const express = require('express');
const cors = require('cors');
const generateUniqueCode = require('./utils/codeGenerator'); // Import code generator
const CodeData = require('./models/formData');
require('./db/connect'); // Connects to MongoDB Atlas

const app = express();

// Middleware
app.use(express.json()); // To parse JSON requests
app.use(cors()); // To handle CORS

// Route: POST /api/upload
app.post('/api/upload', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Invalid payload format. Expected an array of records.' });
    }

    const savedRecords = await Promise.all(
      req.body.map(async (record, index) => {
        const { branchName, category, subCategory, half, year, itemCode, size, quantity } = record;

        // Validate required fields
        if (!branchName || !category || !subCategory || !half || !year || !itemCode || !size || !quantity) {
          throw new Error(`Missing required fields in record ${index + 1}`);
        }

        // Ensure year is 2-digit
        if (!/^\d{2}$/.test(year)) {
          throw new Error(`Invalid year format in record ${index + 1}. Expected a 2-digit number.`);
        }

        const parsedYear = parseInt(year, 10);
        const parsedSize = parseInt(size, 10);
        const parsedQuantity = parseInt(quantity, 10);

        if (isNaN(parsedYear) || isNaN(parsedSize) || isNaN(parsedQuantity)) {
          throw new Error(`Invalid numeric values in record ${index + 1}`);
        }

        // Generate unique codes for the quantity
        const generatedCodes = await Promise.all(
          Array.from({ length: parsedQuantity }).map(() => generateUniqueCode())
        );

        // Generate final calculated codes
        const finalCodes = generatedCodes.map((uniqueCode) =>
          `${subCategory}${category}${half}${year}${itemCode}${size}${uniqueCode}`
        );

        const newData = new CodeData({
          branchName,
          category,
          subCategory,
          half,
          year: parsedYear,
          itemCode,
          size: parsedSize,
          quantity: parsedQuantity,
          codes: finalCodes, // Store final calculated codes
        });

        try {
          return await newData.save();
        } catch (saveError) {
          console.error(`Error saving record ${index + 1}:`, saveError);
          throw new Error(`Failed to save record ${index + 1}`);
        }
      })
    );

    res.status(200).json({
      message: 'All records saved successfully!',
      savedRecords,
    });
  } catch (error) {
    console.error('Error in /api/upload:', error.stack || error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});





// Route: GET /api/fetch-data
app.get('/api/fetch-data', async (req, res) => {
  try {
    const data = await CodeData.find(); // Fetch all records from the CodeData collection
    res.status(200).json(data); // Send the fetched data as JSON response
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
