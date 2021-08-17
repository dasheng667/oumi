const files = require('../utils/file');
const modelDb = require('../db/modelDb');

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },

  Mutation: {
    fileOpenInEditor: (root, { input }, context) => files.openInEditor(input, context)
  }
};

module.exports = resolvers;
