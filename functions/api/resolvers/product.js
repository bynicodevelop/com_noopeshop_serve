const {listProducts, storeProduct} = require('../../repositories/product');

const productQuery = {
  products: async (parent, args, {firestore, error}, info) => {
    const product = await listProducts({}, {firestore, error});

    return [...product];
  },
};

const productMutation = {
  createProduct: async (
      parent,
      {productInput: {name, description, categories}},
      {firestore},
  ) => {
    const result = await storeProduct({
      name,
      description,
      categories,
    }, firestore);

    return {
      __typename: 'Product',
      ...result,
    };
  },
};

exports.productQuery = productQuery;
exports.productMutation = productMutation;
