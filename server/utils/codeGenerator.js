const { customAlphabet } = require('nanoid');
const CodeData = require('../models/formData');

// Nanoid configuration
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generateCode = customAlphabet(alphabet, 6);

// Generate a unique code
async function generateUniqueCode() {
  let uniqueCode;
  do {
    uniqueCode = generateCode(); // Generate random 6-character code
    const existingCode = await CodeData.findOne({ codes: uniqueCode });
    if (existingCode) {
      console.log(`Duplicate code found: ${uniqueCode}`);
    }
  } while (await CodeData.exists({ codes: uniqueCode })); // Keep generating if a duplicate is found

  return uniqueCode;
}

module.exports = generateUniqueCode;
