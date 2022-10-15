const {
  categoryQuery,
  categoryMutation,
} = require('./resolvers/category_resolver');
const {
  productMutation,
  productQuery,
} = require('./resolvers/product_resolver');
const {
  userQuery,
  userMutation,
} = require('./resolvers/user_resolver');
const {
  aliexpressProductMutation,
} = require('./resolvers/aliexpress_product');
const {
  mediaQuery,
} = require('./resolvers/media_resolver');

const resolvers = {
  Query: {
    ...userQuery,
    ...productQuery,
    ...categoryQuery,
  },
  Product: {
    ...mediaQuery,
  },
  Mutation: {
    ...userMutation,
    ...categoryMutation,
    ...productMutation,
    ...aliexpressProductMutation,
  },
};

module.exports = resolvers;
