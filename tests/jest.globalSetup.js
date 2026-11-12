const { start } = require('./mongodb-memory');

module.exports = async function () {
  await start();
};
