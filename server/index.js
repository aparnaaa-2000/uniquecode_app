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
// Route: POST /api/upload
app.post('/api/upload', async (req, res) => {
  try {
    console.log('Received data:', req.body); // Log the entire payload

    // Check if payload is an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Invalid payload format. Expected an array of records.' });
    }

    const savedRecords = await Promise.all(
      req.body.map(async (record, index) => {
        console.log(`Processing record ${index + 1}:`, record); // Debug each record

        // Destructure fields for validation
        const { branchName, category, subCategory, half, year, itemCode, size, quantity } = record;

        // Validate required fields
        if (!branchName || !category || !subCategory || !half || !year || !itemCode || !size || !quantity) {
          console.error(`Missing required fields in record ${index + 1}:`, record); // Log problematic record
          throw new Error(`Missing required fields in record ${index + 1}`);
        }

        // Parse numeric fields
        const parsedYear = parseInt(year, 10);
        const parsedSize = parseInt(size, 10);
        const parsedQuantity = parseInt(quantity, 10);

        if (isNaN(parsedYear) || isNaN(parsedSize) || isNaN(parsedQuantity)) {
          console.error(`Invalid numeric values in record ${index + 1}:`, record); // Log problematic record
          throw new Error(`Invalid numeric values in record ${index + 1}`);
        }

        // Generate unique codes
        const codes = await Promise.all(
          Array.from({ length: parsedQuantity }).map(() => generateUniqueCode())
        );

        // Save to MongoDB
        const newData = new CodeData({
          branchName,
          category,
          subCategory,
          half,
          year: parsedYear,
          itemCode,
          size: parsedSize,
          quantity: parsedQuantity,
          codes,
        });

        return await newData.save(); // Save record
      })
    );

    res.status(200).json({
      message: 'All records saved successfully!',
      savedRecords, // Return saved records
    });
  } catch (error) {
    console.error('Error in /api/upload:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});



// Route: GET /api/fetch-data
app.get('/api/fetchdata', async (req, res) => {
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
