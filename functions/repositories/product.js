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

const storeProduct = async ({
  productId,
  name,
  description,
  categories,
}, {firestore}) => {
  const {id: uid} = await firestore
      .collection('products')
      .add({
        productId,
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

const addMediaToProduct = async (productUid, medias, {firestore}) => {
  const mediaRef = await firestore
      .collection('products')
      .doc(productUid)
      .collection('medias');

  await Promise.all(medias.map(async ({hash, filename}, order) =>
    mediaRef.doc(hash).set({
      hash,
      filename,
      order,
    })),
  );

  return medias;
};

exports.listProducts = listProducts;
exports.storeProduct = storeProduct;
exports.addMediaToProduct = addMediaToProduct;
