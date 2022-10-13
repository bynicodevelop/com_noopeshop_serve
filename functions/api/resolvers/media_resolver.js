const {getMediaFromProduct} = require('../../repositories/media');

const mediaQuery = {
  media: async ({uid}, args, {firestore}) =>
    getMediaFromProduct(uid, {firestore}),
};

exports.mediaQuery = mediaQuery;
