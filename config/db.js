const mongoose = require('mongoose');
const db = process.env.MONGO_URI || 'mongodb://localhost/blogIT';

module.exports = mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(console.log(`MongoDB connected..`))
  .catch((err) => console.log(err));
