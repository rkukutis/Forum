const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    profileImg: { type: String, default: 'default.png' },
    userType: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'moderator'],
    },
    email: { type: String, required: false },
    password: { type: String, required: true },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password; // passwordConfirm === password
        },
        message: 'passwords are not the same',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: { type: Boolean, default: true, select: false },
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modifed
  if (!this.isModified('password')) return next();

  // hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
