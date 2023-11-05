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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: String,
});
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
