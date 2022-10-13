const {
  getCategoriesFromProduct,
  storeCategory,
} = require('../../repositories/category');

const categoryQuery = {
  categories: async ({uid: productUid}, args, {firestore, error}, info) =>
    getCategoriesFromProduct(productUid, {firestore}),
};

const categoryMutation = {
  createCategory: async (parent, {name, description}, {firestore}, info) => {
    const category = await storeCategory({name, description}, firestore);

    return {
      __typename: 'Category',
      ...category,
    };
  },
};

exports.categoryQuery = categoryQuery;
exports.categoryMutation = categoryMutation;
