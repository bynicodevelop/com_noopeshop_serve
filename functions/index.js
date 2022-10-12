const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const graphql = require('./api');

exports.api = functions.https.onRequest(graphql);


