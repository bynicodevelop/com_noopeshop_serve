const _ = require('lodash');
const {storeUser, removeUser} = require('../../repositories/users.js');

const userQuery = {};

const userMutation = {
  createUser: async (parent, {email, displayName, photoURL}, context) => {
    const result = await storeUser({
      email,
      displayName,
      photoURL,
    });

    if (_.isString(result)) {
      return {
        __typename: 'EmailAlreadyExistsError',
        code: result,
      };
    }

    return {
      __typename: 'User',
      ...result,
    };
  },
  deleteUser: async (parent, {uid}, context) => removeUser(uid),
};

exports.userQuery = userQuery;
exports.userMutation = userMutation;
