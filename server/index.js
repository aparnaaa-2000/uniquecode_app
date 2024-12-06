const express = require('express');
const cors = require('cors');
const generateUniqueCode = require('./utils/codeGenerator'); // Adjust the path to match your project structure
const CodeData = require('./models/formData');
require('./db/connect')
const app = express();

app.use(express.json());
app.use(cors());

// Example Route Using `generateUniqueCode`
app.post('/api/upload', async (req, res) => {
  try {
    const { branchName, category, subcategory, half, year, itemCode, size, quantity } = req.body;

    let codes = [];
    for (let i = 0; i < quantity; i++) {
      const uniqueCode = await generateUniqueCode(subcategory, category, half, year, itemCode, size);
      codes.push(uniqueCode);
    }

    const newData = new CodeData({
      branchName,
      category,
      subcategory,
      half,
      year,
      itemCode,
      size,
      quantity,
      codes,
    });

    await newData.save();
    res.status(200).json({ message: 'Data saved successfully!', codes });
  } catch (error) {
    console.error('Error in /api/upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
