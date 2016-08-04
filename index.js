/*
 * Root component of Siphon Sandbox
 */

 //#############################################################################
 // Imports
 //#############################################################################

'use strict';

var React = require('react-native');
var EventEmitter = require('EventEmitter');
var SPAppManager = require('react-native').NativeModules.SPAppManager;

// Views
var LoadingView = require('./components/loading-view');
var LoginView = require('./components/login-view');
var AppCollectionView = require('./components/app-collection-view');

// Helpers
var Storage = require('./utils/storage-utils');

var constants = require('./sandbox-constants');

var {
  AppRegistry,
  DeviceEventEmitter,
  Navigator,
  Platform,
  StyleSheet,
  StatusBar,
  NativeModules,
} = React;

// Mixpanel
var Mixpanel = NativeModules.RNMixpanelManager;

var MIXPANEL_TOKEN = constants.MIXPANEL_TOKEN;

//#############################################################################
// Globals
//#############################################################################

global.broker = new EventEmitter();
global.AUTH_TOKEN = null;

//#############################################################################
// Routes for use by the navigator
//#############################################################################

var NAV_ROUTES = {
  LoadingView: {name: 'LoadingView'},
  LoginView: {name: 'LoginView'},
  AppCollectionView: {name: 'AppCollectionView'},
  SiphonAppView: {
    name: 'SiphonAppView',
    appName: null,
    appId: null,
  },
};

//#############################################################################
// Root Application
//#############################################################################

var SiphonSandbox = React.createClass({

  componentWillMount: function() {
    // Set the style of the status bar
    if (Platform.OS == 'ios') {
      StatusBar.setBarStyle('default', true);
    } else {
      StatusBar.setBackgroundColor('black', true);
    }
  },

  componentDidMount: function() {
    // The navigator component we are rendering
    Mixpanel.sharedInstanceWithToken(MIXPANEL_TOKEN);
    var navigator = this.refs.navigator;
    // Bindings
    global.broker.addListener('auth:success', (token) => {
      Storage.saveToken(token)
        .then(() => {
          navigator.replace(NAV_ROUTES.AppCollectionView);
          if (Platform.OS == 'ios') {
            StatusBar.setBarStyle('light-content', true);
          } else {
            StatusBar.setBackgroundColor('white', true);
          }
        });
    });

    global.broker.addListener('auth:fail', () => {
      navigator.replace(NAV_ROUTES.LoginView);
    });

    global.broker.addListener('auth:token:exists', (token) => {
      navigator.replace(NAV_ROUTES.AppCollectionView);
      if (Platform.OS == 'ios') {
        StatusBar.setBarStyle('light-content', false);
      } else {
        StatusBar.setBackgroundColor('white', false);
      }
    });

    global.broker.addListener('auth:logout', () => {
      navigator.replace(NAV_ROUTES.LoginView);
      if (Platform.OS == 'ios') {
        StatusBar.setBarStyle('default', true);
      } else {
        StatusBar.setBackgroundColor('black', true);
      }

      Storage.deleteToken().then(() => {
      });
    });

    global.broker.addListener('app:present', (appData) => {
      if (Platform.OS == 'ios') {
        StatusBar.setBarStyle('default', true);
      } else {
        StatusBar.setBackgroundColor('black', true);
      }

      Storage.getDevMode().then((setting) => {
        SPAppManager.presentApp(appData.appId, global.AUTH_TOKEN, setting);
        Mixpanel.trackWithProperties('Sandbox: App presented', {
          app_id: appData.appId,
          app_name: appData.name,
        });
      });
    });

    this.appDismissedSub = DeviceEventEmitter.addListener('appDismissed', (event) => {
      console.log('App dismissed');
      Mixpanel.trackWithProperties('Sandbox: App dismissed', {
        app_id: event.appId,
      });
      if (Platform.OS == 'ios') {
        StatusBar.setBarStyle('light-content', false);
      } else {
        StatusBar.setBackgroundColor('white', false);
      }
    });

    // Check if the token exists and emit the corresponding event.
    Storage.getToken()
      .then((tkn) => {
        global.AUTH_TOKEN = tkn;
      }).then(() =>  {
        global.broker.emit('auth:token:exists');
      }).catch((error) => {
        global.AUTH_TOKEN = null;
        global.broker.emit('auth:fail');
      });
  },

  renderScene: function(route, nav) {
    // Used by the navigator to determine the component to render
    switch (route) {
      case NAV_ROUTES.LoadingView:
        return <LoadingView/>;
      case NAV_ROUTES.LoginView:
        return <LoginView/>;
      case NAV_ROUTES.AppCollectionView:
        return <AppCollectionView/>;
      case NAV_ROUTES.SiphonAppView:
        return;
      default:
        return <LoginView/>;
    }
  },

  render: function() {

    var initialRoute = {name: 'LoadingView'};

    return (
      <Navigator ref="navigator"
        initialRoute={initialRoute}
        renderScene={this.renderScene}
        configureScene={() => ({
          ...Navigator.SceneConfigs.HorizontalSwipeJump,
          gestures: {}
        })}
      />
    );
  }
});

var styles = StyleSheet.create({
  appView: {
    flex: 1,
  },
});

AppRegistry.registerComponent('App', () => SiphonSandbox);
