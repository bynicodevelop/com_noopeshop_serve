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

// TODO: Add price to variant
const addVariantToProduct = async (productUid, {
  sku,
  name,
  displayName,
}, {firestore}) => {
  const data = {
    sku,
    name,
    displayName,
  };

  const {id: uid} = await firestore
      .collection('products')
      .doc(productUid)
      .collection('variants')
      .add(data);

  return {
    uid,
    ...data,
  };
};

const addVariantsToProduct = async (productUid, variants, {firestore}) => {
  const variantsResult = await Promise.all(variants.map(async (variant) =>
    addVariantToProduct(
        productUid,
        variant,
        {
          firestore,
        },
    )),
  );

  return variantsResult;
};

const addMediaToVariant = async (productUid, variant, {firestore}) => {
  const {uid, filename, hash} = variant;

  await firestore
      .collection('products')
      .doc(productUid)
      .collection('variants')
      .doc(uid)
      .update({
        media: {
          filename,
          hash,
        },
      });

  return {
    uid,
    media: {
      filename,
      hash,
    },
  };
};

exports.listProducts = listProducts;
exports.storeProduct = storeProduct;
exports.addMediaToProduct = addMediaToProduct;
exports.addVariantsToProduct = addVariantsToProduct;
exports.addMediaToVariant = addMediaToVariant;
