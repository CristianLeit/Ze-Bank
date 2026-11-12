const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

async function start() {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
    process.env.NODE_ENV = 'test';
  }
  return mongod;
}

async function stop() {
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}

module.exports = { start, stop };
