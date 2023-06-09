const argon2 = require('argon2');

exports.hashPassword = async (password) => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error(error);
  }
};

exports.comparePasswords = async (hash, password) =>
  await argon2.verify(hash, password);
