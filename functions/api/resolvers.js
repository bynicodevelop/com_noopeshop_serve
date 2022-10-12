const {categoryQuery, categoryMutation} = require('./resolvers/category');
const {productMutation, productQuery} = require('./resolvers/product');
const {userQuery, userMutation} = require('./resolvers/user');
const {aliexpressProductMutation} = require('./resolvers/aliexpress_product');

const resolvers = {
  Query: {
    ...userQuery,
    ...categoryQuery,
    ...productQuery,
  },
  Mutation: {
    ...userMutation,
    ...categoryMutation,
    ...productMutation,
    ...aliexpressProductMutation,
  },
};

module.exports = resolvers;
