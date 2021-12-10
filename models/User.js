const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  google_id: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
