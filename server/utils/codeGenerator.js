// const { customAlphabet } = require('nanoid');

// // Create a custom alphabet consisting of uppercase letters and a length of 6
// const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const generateCode = customAlphabet(alphabet, 6);

// // Function to generate the unique code
// function generateUniqueCode(branchName, subCategory, category, half, halfValue, year, itemCode, size, quantity) {
//     return generateCode(); // This generates a unique 6-character code each time
// }

// module.exports = generateUniqueCode;


// codeGenerator.js
// codeGenerator.js
// codeGenerator.js
const { customAlphabet } = require('nanoid');

// Create a custom alphabet consisting of uppercase letters and digits (alphanumeric characters)
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generateCode = customAlphabet(alphabet, 4); // 6-character code

let generatedCodes = new Set();

function generateUniqueCode(subcategory, category, half, year, itemCode, size) {
    let uniqueCode;
    
    // Loop until we generate a unique code
    do {
        uniqueCode = generateCode();  // Generate a random 6-character code
    } while (generatedCodes.has(uniqueCode));  // If code already exists, regenerate
    
    // Add the generated code to the set
    generatedCodes.add(uniqueCode);

    // You could also store this code in your MongoDB or Redis for persistent storage if needed
    // This way, you'll always have a list of unique codes across sessions

    // Optionally, combine with base string for more structure
    const baseString = `${subcategory}${category}${half}${year}${itemCode}${size}`;
    const finalCode = `${uniqueCode}${baseString.slice(0, 2)}`;

    console.log("Generated Code: ", finalCode);  // This will show the final code
    return finalCode;
}

module.exports = generateUniqueCode;

// Export with the correct name

  
