const argon2 = require('argon2');

module.exports = async (password) => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error(error);
  }
};
