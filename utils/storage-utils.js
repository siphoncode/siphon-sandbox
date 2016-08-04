/*
* Helpers for storing data
*/
var React = require('react-native');
var request = require('superagent');
var constants = require('../sandbox-constants');

var {
  AsyncStorage,
} = React;

var TOKEN_STORAGE_KEY = constants.TOKEN_STORAGE_KEY;
var DEV_MODE_STORAGE_KEY = constants.DEV_MODE_STORAGE_KEY;

module.exports = {
  // These return a promise which is fulfilled when AsyncStorage.someMethod is
  // finished.
  saveToken: async function(token) {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    return;
  },

  getToken: async function() {
    var tkn = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (tkn) {
      return tkn;
    } else {
      throw Error('Token does not exist');
    }
  },

  deleteToken: async function() {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      return;
    } catch(error) {
      console.log(error.message);
    }
  },

  getDevMode: async function() {
    var devMode = await AsyncStorage.getItem(DEV_MODE_STORAGE_KEY);
    if (!devMode) {
      await AsyncStorage.setItem(DEV_MODE_STORAGE_KEY, 'true');
      return true;
    } else {
      return devMode == 'true';
    }
  },

  toggleDevMode: async function() {
    var devMode = await AsyncStorage.getItem(DEV_MODE_STORAGE_KEY);
    if (devMode == 'false') {
      await AsyncStorage.setItem(DEV_MODE_STORAGE_KEY, 'true');
      return true;
    } else {
      await AsyncStorage.setItem(DEV_MODE_STORAGE_KEY, 'false');
      return false;
    }
  },

};
