const getCategoriesFromProduct = async (uid, {firestore}) => {
  const {docs} = await firestore()
      .collection('products')
      .doc(uid)
      .collection('categories')
      .get();

  if (docs.length === 0) {
    return [];
  }

  return docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
};

const getCategory = async (uid, {firestore}) => {
  try {
    const doc = await firestore().collection('categories').doc(uid).get();

    return {
      uid: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const listCategories = async (data, {firestore}) => {
  try {
    const {docs} = await firestore().collection('categories').get();

    return docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(error);
  }
};

const storeCategory = async ({name, description}, firestore) => {
  const now = new Date();

  const {id: uid} = await firestore()
      .collection('categories')
      .add({
        name,
        description,
        createdAt: now,
        updatedAt: now,
      });

  return {
    uid,
    name,
    description,
  };
};

exports.getCategoriesFromProduct = getCategoriesFromProduct;
exports.getCategory = getCategory;
exports.listCategories = listCategories;
exports.storeCategory = storeCategory;

