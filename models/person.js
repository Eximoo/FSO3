const { default: mongoose } = require('mongoose');
const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose
  .connect(String(url))
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB:`, err);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

module.exports = mongoose.model('Person', personSchema);
