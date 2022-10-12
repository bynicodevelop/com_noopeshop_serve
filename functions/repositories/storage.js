const uploadToBucket = async (media, storage) => {
  const {path, storagePath} = media;
  const bucket = storage.bucket();

  const file = await bucket.upload(path, {
    destination: storagePath,
  });

  return {
    ...media,
    ...{file},
  };
};

const getUrlsFromBucket = async (bucketPath, storage) => {
  const bucket = storage.bucket();

  const file = bucket.file(bucketPath);

  const [metadata] = await file.getMetadata();

  return {
    url: metadata.mediaLink,
  };
};

exports.uploadToBucket = uploadToBucket;
exports.getUrlsFromBucket = getUrlsFromBucket;
