const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);

const postSchema = new mongoose.Schema(
  {
    author: {
      img: String,
      name: String,
    },
    body: { title: String, date: Date, text: String },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
