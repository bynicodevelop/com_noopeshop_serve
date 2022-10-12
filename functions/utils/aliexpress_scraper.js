const scrape = require('aliexpress-product-scraper');
const {NodeHtmlMarkdown} = require('node-html-markdown');

const extractVariants = ({variants: {options, prices}}) => {
  const {name: variantName, values} = options[0];

  const variantValues = values.map((value) => {
    const {id, name, displayName, image} = value;

    const filteredPrice = prices.filter(({optionValueIds}) =>
      parseInt(optionValueIds) === id,
    );

    if (filteredPrice.length > 0) {
      const {
        skuId: sku,
        availableQuantity: quatity,
        salePrice: price,
      } = filteredPrice[0];

      return {
        sku,
        name,
        displayName,
        image,
        price: {
          price,
          quatity,
        },
      };
    }

    return null;
  }).filter((value) => value !== null);


  return {
    variantName,
    variantValues,
  };
};

const extractProduct = async ({
  title,
  productId,
  images,
  description,
}) => {
  const markdown = NodeHtmlMarkdown.translate(
      description,
      {},
  );

  return {
    title,
    productId,
    images,
    description: markdown,
  };
};


const scraper = async (productId) => {
  const product = scrape(productId);

  const result = await product;

  const productExtrated = await extractProduct(result);

  const variantsExtrated = extractVariants(result);

  return {
    ...productExtrated,
    ...{
      variants: variantsExtrated,
    },
  };
};


exports.scraper = scraper;
