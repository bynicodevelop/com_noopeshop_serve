const admin = require('firebase-admin');
const {error} = require('firebase-functions/lib/logger');

const storeUser = async ({email, displayName, photoURL}) => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      displayName,
      photoURL,
    });

    return userRecord;
  } catch (e) {
    error('storeUser error', {
      code: e.code,
      message: e.message,
    });

    return e.code;
  }
};

const removeUser = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);

    return true;
  } catch (e) {
    error('removeUser error', {
      code: e.code,
      message: e.message,
    });

    return false;
  }
};

exports.storeUser = storeUser;
exports.removeUser = removeUser;
