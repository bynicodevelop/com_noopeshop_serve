const listProducts = async (data, {firestore, error}) => {
  try {
    const snapshot = await firestore.collection('products').get();

    return snapshot.docs.map(async (doc) => {
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
    console.log(categoriesResult);
    error(e);
  }
};

const storeProduct = async ({name, description, categories}, firestore) => {
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
