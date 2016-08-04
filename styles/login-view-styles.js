
var React = require('react-native');
var Device = require('../utils/device-utils.js');

var {
  StyleSheet,
} = React;

var styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoImage: {
    marginTop: 50,
  },
  formContainer: {
    flex: 3,
    alignItems: 'center',
  },
  formItem: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderColor: '#cdcdcd',
    padding: 10,
  },
  button: {
    justifyContent: 'center',
    borderWidth: 0,
    backgroundColor: '#7da2b8',
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
  },
  spinner: {
    position: 'absolute',
    right: 10,
    top: 0,
  },
  message: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: 'gray',
  },
  versionMessage: {
    position: 'absolute',
    bottom: 15,
    fontSize: 12,
    color: 'gray',
  },
};

// Modify components based on the current Device
var contentWidth;

if (Device.isIphone()) {
  contentWidth = Math.round(Device.width * 0.66);
  styles.versionMessage.left = Math.round((Device.width - contentWidth) / 2);
} else {
  contentWidth = 310;
  styles.versionMessage.left = 35;
}

styles.logoImage.width = contentWidth;
styles.formItem.width = contentWidth;
styles.message.width = contentWidth;

var styleSheet = StyleSheet.create(styles);

module.exports = styleSheet;
