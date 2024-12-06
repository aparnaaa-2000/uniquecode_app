const { customAlphabet } = require('nanoid');
const CodeData = require('../models/formData'); // Adjust the path if needed

// Nanoid configuration
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generateCode = customAlphabet(alphabet, 6);

// Generate Unique Code Function
async function generateUniqueCode(subcategory, category, half, year, itemCode, size) {
  let uniqueCode;
  do {
    uniqueCode = generateCode(); // Generate a random 6-character code
    const existingCode = await CodeData.findOne({ codes: uniqueCode }); // Check for duplicates
    if (existingCode) {
      console.log(`Duplicate code found: ${uniqueCode}`);
    }
  } while (await CodeData.exists({ codes: uniqueCode })); // Regenerate if duplicate

  return uniqueCode;
}

module.exports = generateUniqueCode; // Ensure this function is exported correctly
