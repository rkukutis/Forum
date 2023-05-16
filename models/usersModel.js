const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    profileImg: { type: String, default: 'default.png' },
    userType: { type: String, default: 'user' },
    password: { type: String, required: true },
    email: { type: String, required: false },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
