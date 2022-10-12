const storeCategory = async ({name, description}, firestore) => {
  const now = new Date();

  const {id: uid} = await firestore
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

exports.storeCategory = storeCategory;

