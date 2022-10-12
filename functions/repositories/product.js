const listProducts = async (data, {firestore}) => {
  try {
    const {docs} = await firestore.collection('products').get();

    return docs.map(async (doc) => {
      const {categories} = doc.data();

      const categoriesResult = await Promise.all(categories
          .map(async ({uid}) => {
            const categoryRef = await firestore
                .collection('categories')
                .doc(uid)
                .get();

            return {
              uid: categoryRef.id,
              ...categoryRef.data(),
            };
          }),
      );

      return {
        uid: doc.id,
        ...doc.data(),
        ...{categories: categoriesResult},
      };
    });
  } catch (e) {
    throw new Error(e);
  }
};

const storeProduct = async ({name, description, categories}, {firestore}) => {
  console.log(categories);

  const {id: uid} = await firestore
      .collection('products')
      .add({
        name,
        description,
        categories,
      });

  return {
    uid,
    name,
    description,
  };
};

exports.listProducts = listProducts;
exports.storeProduct = storeProduct;
