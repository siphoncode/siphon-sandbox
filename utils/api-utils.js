/*
* Helpers for interacting with the siphon API
*/

var request = require('superagent');
var constants = require('../sandbox-constants');

var API_URL = constants.API_URL;

function _callAPI(endpoint, params={}) {
  var url = API_URL + endpoint + '/';
  var token = global.AUTH_TOKEN;

  var promise = new Promise(function(resolve, reject) {
    request
      .get(url)
      .query(params)
      .set({'X-Siphon-Token': token})
      .end(function(error, response) {
        if (error && error.status === 401) {
          reject(Error('Token is invalid.'));
        } else if (response && response.ok) {
          var r = JSON.parse(response.text);
          resolve(r);
        } else {
          reject(error.message);
        }
      });
  });

  return promise;

};

module.exports = {
  getApps: function() {
    return _callAPI('apps');
  },

  getAccountInfo: function() {
    return _callAPI('accounts/info');
  },

  connectToStreamer: function(appId, connType) {
    var promise = new Promise(function(resolve, reject) {
      _callAPI('streamers', {app_id: appId, type: connType}).
        then((response) => {
          var ws = new WebSocket(response.streamer_url)
          resolve(ws);
        }).catch((error) => reject(error));
    });
    return promise;
  },

  tokenIsValid: function() {
    var url = API_URL + 'apps/';
    var token = global.AUTH_TOKEN;

    promise = new Promise(function(resolve, reject) {
      request
        .get(url)
        .set({'X-Siphon-Token': token})
        .end(function(error, response) {
          if (error && error.status === 401) {
            reject(Error('Token is invalid.'));
          } else if (response && response.ok) {
            resolve(true);
          } else {
            reject(Error('An error occurred.'));
          }
        });
    });

    return promise;
  },
};
