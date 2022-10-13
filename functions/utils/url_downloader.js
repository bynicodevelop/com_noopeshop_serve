const md5 = require('md5');
const Downloader = require('nodejs-file-downloader');

const renameFile = (url) => {
  const filename = url.split('/').pop();

  const hash = md5(url);
  const ext = filename.substr(filename.lastIndexOf('.'));
  return {
    filename: `${md5(url)}${ext}`,
    hash,
  };
};

const optionsFactory = (urls) => urls.map((file) => {
  const {url} = file;

  return {
    ...file,
    ...renameFile(url),
  };
});

const downloadUrl = async (url, dest) => {
  const downloader = new Downloader({
    url,
    directory: dest,
  });

  try {
    const {filePath} = await downloader.download();

    return {
      path: filePath,
    };
  } catch (error) {
    // Error: EEXIST: file already exists
  }

  return {
    path: dest,
  };
};

const urlDownloader = async (urls, tmpDirectory = '/tmp') => {
  const options = optionsFactory(urls);

  return Promise.all(options.map(async (file) => {
    const {url, filename, hash} = file;

    const {path} = await downloadUrl(
        url,
        `${tmpDirectory.replace(/\/$/, '')}/${filename}`,
    );

    return {
      ...file,
      path,
      filename,
      hash,
    };
  }),
  );
};

exports.urlDownloader = urlDownloader;
