const scrape = require('aliexpress-product-scraper');
const {extractProduct, extractVariants} = require('./extractProduct');

const productId = '32989626288';

const product = scrape(productId);

(async () => {
  const result = await product;

  const productExtrated = await extractProduct(result);

  const variantsExtrated = extractVariants(result);

  const productData = {
    ...productExtrated,
    ...{
      variants: variantsExtrated,
    },
  };

  console.log(productData);
})();
