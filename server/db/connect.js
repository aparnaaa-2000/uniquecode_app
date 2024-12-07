// const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://aparnarajendran:aparna@cluster0.2jjfvoh.mongodb.net/formData?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((err) => {
//   console.error('Error connecting to MongoDB:', err.message);
// });

const mongoose = require('mongoose');

// Connection string for MongoDB Atlas
const DB_URI = 'mongodb+srv://aparnarajendran:aparna@cluster0.2jjfvoh.mongodb.net/formData?retryWrites=true&w=majority';

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
  });
