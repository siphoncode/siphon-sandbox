/*
* Helpers for accessing device information
*/

var React = require('react-native');

var {
  Dimensions,
  Platform,
} = React;

module.exports = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,

  isIphone: function() {
    return Platform.OS == 'ios' &&  this.width <= 414;
  },

  isIphone4: function() {
    return (Platform.OS == 'ios' && this.width === 320 && this.height === 480);
  },

  isIphone5: function() {
    return (Platform.OS == 'ios' && this.width === 320 && this.height === 568);
  },

  isIphone6: function() {
    return Platform.OS == 'ios' && this.width === 370;
  },

  isIphone6Plus: function() {
    return Platform.OS == 'ios' && this.width === 414;
  },

  isIpad: function() {
    return Platform.OS == 'ios' && !this.isIphone();
  },
};
