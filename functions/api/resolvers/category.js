const {
  getCategory,
  listCategories,
  storeCategory,
} = require('../../repositories/category');

const categoryQuery = {
  category: async (parent, args, {firestore}, info) => {
    const category = await getCategory(args.uid, {
      firestore,
    });

    return {
      __typename: 'Category',
      ...category,
    };
  },
  categories: async (parent, args, {firestore, error}, info) => {
    const categories = [];

    try {
      const categoryResult = await listCategories(args, {firestore});

      for await (const category of categoryResult) {
        categories.push(category);
      }
    } catch (e) {
      error(e);
    }

    return [...categories];
  },
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
