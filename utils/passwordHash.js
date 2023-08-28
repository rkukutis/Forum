const argon2 = require('argon2');

exports.hashPassword = async (password) => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.comparePasswords = async (hash, password) => {
  try {
    await argon2.verify(hash, password);
  } catch (error) {
    throw new Error(error.message);
  }
};
