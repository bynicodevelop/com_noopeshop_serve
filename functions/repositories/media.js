const getMediaFromProduct = async (productUid, {firestore}) => {
  const {docs} = await firestore()
      .collection('products')
      .doc(productUid)
      .collection('medias')
      .get();

  if (docs.length === 0) {
    return [];
  }

  return docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
};

exports.getMediaFromProduct = getMediaFromProduct;
