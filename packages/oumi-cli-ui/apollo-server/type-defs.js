const { gql } = require('apollo-server-koa');

const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    fileOpenInEditor(input: OpenInEditorInput!): Boolean
  }

  input OpenInEditorInput {
    file: String!
    line: Int
    column: Int
    gitPath: Boolean
  }
`;

module.exports = typeDefs;
