function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function generateCode(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n)).toUpperCase();
  }
  return retVal;
}
class CustomError extends Error {
  constructor({ name, message }) {
    super(message);
    this.name = name;
    this.error = {};
    this.error.message = message;
    this.stack = new Error().stack;
  }
}
CustomError.prototype = new Error();

module.exports = { generateRandomNumber, CustomError,generateCode };
