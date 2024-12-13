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
// Route: GET /api/fetch-data
app.get('/api/fetch-data', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Items per page
    const skip = (page - 1) * limit; // Skip items for pagination

    // Fetch total count for pagination metadata
    const total = await CodeData.countDocuments();

    // Fetch paginated data
    const data = await CodeData.find().skip(skip).limit(limit);

    // Group data by unique product details
    const groupedData = data.reduce((acc, item) => {
      const key = `${item.branchName}-${item.category}-${item.subCategory}-${item.half}-${item.year}-${item.itemCode}-${item.size}`;

      // Ensure all fields are included in the grouping
      if (!acc[key]) {
        acc[key] = {
          branchName: item.branchName,
          category: item.category,
          subCategory: item.subCategory,
          half: item.half,
          year: item.year,
          itemCode: item.itemCode,
          size: item.size,
          quantity: item.quantity,
          codes: [...item.codes], // Initialize codes array
        };
      } else {
        acc[key].codes.push(...item.codes); // Append new codes to the existing group
      }

      return acc;
    }, {});

    // Convert grouped object to an array
    const groupedArray = Object.values(groupedData);

    // Send response with pagination metadata
    res.status(200).json({
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: groupedArray,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded.' });
      }

      const fileExt = path.extname(req.file.originalname).toLowerCase();
      if (fileExt !== '.csv') {
          return res.status(400).json({ error: 'Invalid file type. Please upload a CSV file.' });
      }

      const filePath = req.file.path;
      const rows = [];
      
      // Parse CSV
      await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
              .pipe(csv())
              .on('data', (row) => {
                  rows.push(row);
              })
              .on('end', resolve)
              .on('error', reject);
      });

      if (rows.length === 0) {
          return res.status(400).json({ error: 'No valid rows found in the CSV file.' });
      }

      // Process rows (add your logic here)

      fs.unlinkSync(filePath); // Clean up uploaded file
      res.status(200).json({ message: 'File processed successfully', rowsProcessed: rows.length });
  } catch (error) {
      console.error('Error processing file:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
