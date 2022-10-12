const admin = require('firebase-admin');
const express = require('express');
const {join} = require('path');
const {createServer} = require('@graphql-yoga/node');
const {loadFilesSync} = require('@graphql-tools/load-files');
const {mergeTypeDefs} = require('@graphql-tools/merge');

const resolvers = require('./resolvers');
const {logger} = require('../utils/logger');

const app = express();
const firestore = admin.firestore();

const typesArray = loadFilesSync(join(__dirname, './types'));

const graphQLServer = createServer({
  schema: {
    typeDefs: mergeTypeDefs(typesArray),
    resolvers,
  },
  context() {
    return {
      firestore,
      ...logger,
    };
  },
});

app.use('/', graphQLServer);

module.exports = app;
