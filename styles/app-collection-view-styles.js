var React = require('react-native');

var Device = require('../utils/device-utils');

var {
  StyleSheet,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  collectionContainer: {
    backgroundColor:'#ffffff',
    width: Device.width,
    //flex: 1,
  },
  collection: {
    flex: 1,
    flexDirection: 'row',
  },
  toolbar: {
    flexDirection:'row',
    backgroundColor: '#6b97b1',
    paddingTop:30,
    paddingBottom:10,
  },
  toolbarItemLeft: {
    width: 60,
    marginLeft: 30,
    alignItems: 'flex-start',
  },
  toolbarItemRight: {
    width: 60,
    marginRight: 30,
    alignItems: 'flex-end',
  },
  toolbarTitle: {
    color:'#ffffff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 16,
    flex:1,
  },
  refreshSpinner: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  alertView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width:Device.width,
    height: 50,
    backgroundColor: 'orange',
    justifyContent: 'center',
  },
  alertText: {
    color: 'white',
    textAlign: 'center',
  },
});

module.exports = styles;
