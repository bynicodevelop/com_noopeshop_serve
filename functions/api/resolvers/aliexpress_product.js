const _ = require('lodash');
const {scraper} = require('../../utils/aliexpress_scraper');
const {urlDownloader} = require('../../utils/url_downloader');

const {
  storeProduct,
  addMediaToProduct,
  addVariantsToProduct,
  addMediaToVariant,
} = require('../../repositories/product');

const {
  uploadToBucket,
  getUrlsFromBucket,
} = require('../../repositories/storage');

const variantPathBucket = (productUid, variantUid, filename) =>
  `products/${productUid}/variants/${variantUid}/media/${filename}`;

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
      variants,
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

      const {variantValues} = variants;

      /**
       * Ajout de variants au produit
       */
      const variantsResult = await addVariantsToProduct(
          uid,
          variantValues, {
            firestore,
          },
      );

      const variantsImageUrl = variantValues.map((variant) => {
        const {sku, image} = variant;
        return {
          sku,
          url: image,
        };
      });

      const variantsImageUrlDownladed = await urlDownloader(
          variantsImageUrl,
      );

      const variantsMerged = variantsImageUrlDownladed.map((variant) => {
        const {sku, filename} = variant;

        const variantResult = _.find(variantsResult, {sku});

        const {uid: variantUid} = variantResult;

        const storagePath = variantPathBucket(
            uid,
            variantUid,
            filename,
        );

        return {
          storagePath,
          ...variant,
          ...variantResult,
        };
      });

      /**
       * Envoie les images dans le bucket
       */
      const variantMediaUploaded = await Promise.all(variantsMerged.map(
          async (media) => uploadToBucket(
              media,
              storage,
          ),
      ));

      await Promise.all(variantMediaUploaded.map(async (variant) => {
        await addMediaToVariant(uid, variant, {firestore});
      }));

      /**
       * =======================================
       * Media du produit
       * =======================================
       */

      /**
       * Télécharger les images dans un dossier temporaire
       */
      const imagesDownloaded = await urlDownloader(
          images,
      );

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

      // TODO: Retourner toutes les informations du produit
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
