const {listProducts, storeProduct} = require('../../repositories/product');

const productQuery = {
  products: async (parent, args, {firestore, error}, info) => {
    const products = [];

    try {
      const productResult = await listProducts(args, {firestore, error});

      for await (const product of productResult) {
        products.push(product);
      }
    } catch (e) {
      error(e);
    }

    return [...products];
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
    }, {firestore});

    return {
      __typename: 'Product',
      ...result,
    };
  },
};

exports.productQuery = productQuery;
exports.productMutation = productMutation;
