const { stop } = require('./mongodb-memory');

module.exports = async function () {
  await stop();
};
