const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

module.exports = function generateRandomString(stringLength) {
  let randomString = '';
  for (let i = 0; i < stringLength; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * stringLength));
  }

  return randomString;
};
