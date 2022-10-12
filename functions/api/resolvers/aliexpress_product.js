const {scraper} = require('../../utils/aliexpress_scraper');
const {storeProduct, addMediaToProduct} = require('../../repositories/product');
const download = require('image-downloader');
const md5 = require('md5');
const {
  uploadToBucket,
  getUrlsFromBucket,
} = require('../../repositories/storage');

const renameFile = (url) => {
  const filename = url.split('/').pop();

  const hash = md5(url);
  const ext = filename.substr(filename.lastIndexOf('.'));
  return {
    filename: `${md5(url)}${ext}`,
    hash,
  };
};

const imageDownloader = async (images, tmpDirectory = '/tmp') => {
  const options = images.map((url) => ({
    url,
    ...renameFile(url),
  }));

  return Promise.all(options.map(async ({url, filename, hash}) => {
    const fileUploaded = await download.image({
      url,
      dest: `${tmpDirectory.replace(/\/$/, '')}/${filename}`,
    });

    return {
      path: fileUploaded.filename,
      filename,
      hash,
    };
  }),
  );
};

const aliexpressProductMutation = {
  scrapeProduct: async (parent, {
    productIdInput,
  }, {
    firestore,
    storage,
    error,
  }, info) => {
    /**
     * Permet de scraper un produit Aliexpress
     */
    const {
      title: name,
      description,
      productId,
      images,
    } = await scraper(productIdInput);

    try {
      /**
       * Créer le produit dans la base de données
       */
      const productResult = await storeProduct({
        productId,
        name,
        description,
        categories: [],
      }, {
        firestore,
      });

      const {uid} = productResult;

      /**
       * Télécharger les images dans un dossier temporaire
       */
      const imagesDownloaded = await imageDownloader(images);

      /**
       * Permet de compléter les informations des images,
       * pour les envoyer dans le bucket
       */
      const mediaOptions = imagesDownloaded.map((image) => ({
        ...image,
        ...{
          uid,
          storagePath: `products/${uid}/media/${image.filename}`,
        },
      }));

      /**
       * Envoie les images dans le bucket
       */
      const mediaUploaded = await Promise.all(mediaOptions.map(
          async (media) => uploadToBucket(
              media,
              storage,
          ),
      ));

      /**
       * Ajout des images au produit
       */
      await addMediaToProduct(uid, mediaUploaded, {firestore});

      /**
       * Récupère les urls des images
       */
      const urls = await Promise.all(mediaUploaded.map(async (media) => {
        const {filename} = media;

        const mediaUrl = await getUrlsFromBucket(
            `products/${uid}/media/${filename}`,
            storage,
        );

        return {
          ...mediaUrl,
        };
      }));

      return {
        __typename: 'Product',
        ...{
          ...productResult,
          ...{
            media: urls,
          },
        },
      };
    } catch (e) {
      error(e);
    }
  },
};

exports.aliexpressProductMutation = aliexpressProductMutation;
