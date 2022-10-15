const renameFile = (url, encrypt) => {
  const filename = url.split('/').pop();

  const hash = encrypt(url);
  const ext = filename.substr(filename.lastIndexOf('.'));

  return {
    filename: `${hash}${ext}`,
    hash,
  };
};

exports.renameFile = renameFile;
