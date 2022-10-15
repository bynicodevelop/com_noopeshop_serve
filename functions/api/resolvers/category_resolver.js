const {
  listCategories,
  updateCategory,
  storeCategory,
} = require('../../repositories/category');

const categoryQuery = {
  categories: async (parent, args, {firestore, log}, info) => {
    log('Loading categories');

    const categories = listCategories({}, {firestore});

    log('Categories loaded');

    return categories;
  },
};

const categoryMutation = {
  createCategory: async (
      parent,
      {
        categoryInput: {
          name,
          description,
        },
      },
      {firestore, log}) => {
    log('Create category', {
      name,
      description,
    });

    const category = await storeCategory({name, description}, {firestore});

    log('Category created', category);

    return {
      __typename: 'Category',
      ...category,
    };
  },

  updateCategory: async (
      parent,
      {
        categoryInput: {
          uid,
          name,
          description,
        },
      },
      {firestore, log}) => {
    log('Update category', {
      uid,
      name,
      description,
    });

    const category = await updateCategory(
        {uid, name, description},
        {firestore},
    );

    log('Category updated', category);

    return {
      __typename: 'Category',
      ...category,
    };
  },
};

exports.categoryQuery = categoryQuery;
exports.categoryMutation = categoryMutation;
