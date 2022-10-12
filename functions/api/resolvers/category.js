const {storeCategory} = require('../../repositories/category');

const categoryQuery = {
  category: async (parent, args, context, info) => {},
  categories: async (parent, args, context, info) => {},
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
