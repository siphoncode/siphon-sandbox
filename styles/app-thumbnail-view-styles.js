var React = require('react-native');
var Device = require('../utils/device-utils.js');

var {
  StyleSheet,
} = React;

var styles = {
  container: {
    left: 0,
    marginTop: 6,
    justifyContent: 'center',
  },
  icon: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    borderWidth: 1,
    justifyContent: 'center',

    borderColor: '#dddddd',
    borderRadius: 14,
    backgroundColor: '#dddddd',
  },
  iconImage: {
    height: 35,
    width: 35,
    alignSelf: 'center',
    opacity: 0.8,
  },
  name: {
    color: 'gray',
    fontSize: 13,
    alignSelf: 'center',
    marginTop: 4,
  },
};

var iconContainerWidth;

if (Device.isIpad() || Device.isIphone6Plus()) {
  iconContainerWidth = Math.round(Device.width / 4);
} else {
  iconContainerWidth = Math.round(Device.width / 3);
}

styles.container.height = iconContainerWidth;
styles.container.width = iconContainerWidth;

var styleSheet = StyleSheet.create(styles);

module.exports = styleSheet;
