const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, () => {
  console.log('Connected to database');
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  joinDate: { type: Date, default: Date.now() },
  userType: { type: String, default: 'user' },
  password: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
