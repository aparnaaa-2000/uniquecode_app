// Import the nanoid library
const { customAlphabet } = require('nanoid');

// Create a custom alphabet consisting of uppercase letters and a length of 6
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const generateCode = customAlphabet(alphabet, 6);

// Generate the unique product code
const productCode = generateCode();

console.log('Generated Product Code:', productCode);
