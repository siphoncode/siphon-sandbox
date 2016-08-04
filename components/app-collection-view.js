/*
* A collection view that displays the user's apps retrieved from Siphon's API
*/
'use strict';

var React = require('react-native');
var Device = require('../utils/device-utils');
var styles = require('../styles/app-collection-view-styles');
var iconStyles = require('../styles/app-thumbnail-view-styles');
var Icon = require('react-native-vector-icons/Octicons');
var AlertView = require('./alert-view');

var {
  View,
  ScrollView,
  Text,
  LayoutAnimation,
  TouchableOpacity,
  Modal,
  RefreshControl,
  NativeModules,
} = React;

// Additional components
var GridView = require('react-native-grid-view');
var AppThumbnailView = require('./app-thumbnail-view');

// Helpers
var Storage = require('../utils/storage-utils');
var API = require('../utils/api-utils');

// Mixpanel
var Mixpanel = NativeModules.RNMixpanelManager;

var AppCollectionView = React.createClass({
  _streamNotifications: function() {
    // Connect to the streamer. Reopen the connection if it is closed and
    // live == true.
    var _this = this;
    API.connectToStreamer('*', 'notifications')
      .then((ws) => {
        _this.socket = ws;
        ws.onmessage = function(msg) {
          var t = JSON.parse(msg.data).type;
          if (t == 'new_app' || t == 'app_updated') {
            _this.loadData();
          }
        };

        ws.onclose = function() {
          console.log('Connection to notifications stream closed prematurely. ' +
                      'Trying again in 5 seconds.');
          setTimeout(() => _this._streamNotifications(), 5000);
        };

        ws.onerror = function() {
          console.log('Error connecting to notifications stream. ' +
                      'Trying again in 5 seconds.');
          setTimeout(() => _this._streamNotifications(), 5000);
        };
      }).catch((error) => {
        console.log('Unable to connect to notifications stream. Trying again ' +
                    'in 5 seconds.');
        setTimeout(() => _this._streamNotifications(), 5000);
      });
  },

  getInitialState: function() {
    // Set spinner
    return {
      loading: true,
      apps: [],
      devMode: true,
      live: true,
    };
  },

  componentWillMount: function() {
    this.presentAlert = true;
    LayoutAnimation.spring();
    Storage.getDevMode().then((setting) => this.setState({devMode: setting}));
  },

  componentDidMount: function() {
    Mixpanel.track('Sandbox: App collection presented');
    this._streamNotifications();
    this.loadData();
    this.setState({alertEnabled: true});
  },

  componentDidUpdate: function() {
    this.presentAlert = false;
  },

  loadData: function() {
    this.setState({loading: true});
    API.getApps()
      .then((apps) => {
        var appItems = apps.results;
        appItems.sort(function(a, b) {
          return (a.created - b.created);
        });

        this.setState({
          apps: apps.results,
          loading: false,
        });
      }).catch((error) => {
        this.setState({loading: false});
      });
  },

  toggleDevMode: function() {
    Storage.toggleDevMode()
      .then((setting) => {
        this.presentAlert = true;
        this.setState({devMode: setting});
      });
  },

  logOut: function() {
    Mixpanel.track('Sandbox: User logged out');
    global.broker.emit('auth:logout');
  },

  render: function() {
    var itemsPerRow = (Device.isIpad() || Device.isIphone6Plus()) ? 4 : 3;
    var pageSize = Math.ceil(this.state.apps.length / itemsPerRow);
    var contentHeight = iconStyles.container.height;

    var devButtonColor;
    if (this.state.devMode) {
      devButtonColor = 'white';
    } else {
      devButtonColor = '#cccccc';
    }

    var devMessage;
    var devAlert;
    if (this.state.devMode) {
      devMessage = 'Dev mode enabled. Tap the tool icon to turn off ' +
      'warnings and red box errors.';
    } else {
      devMessage = 'Dev mode disabled. Tap the tool icon for ' +
      'detailed logs, warnings and red box errors.';
    }

    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <View style={styles.toolbarItemLeft}>
          <TouchableOpacity onPress={this.toggleDevMode}>
            <Icon name='tools' size={22} color={devButtonColor} />
          </TouchableOpacity>
          </View>
          <Text style={styles.toolbarTitle}>Siphon Sandbox</Text>
          <View style={styles.toolbarItemRight}>
            <TouchableOpacity onPress={this.logOut}>
              <Icon name='sign-out' size={22} color='white' />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={[styles.collectionContainer, {height: contentHeight}]}
          refreshControl={
            <RefreshControl refreshing={this.state.loading} onRefresh={this.loadData}/>
          }
        >
          <GridView
            items={this.state.apps}
            itemsPerRow={itemsPerRow}
            renderItem={this.renderAppItem}
            style={styles.collection}
            scrollEnabled={false}
            pageSize={pageSize}
          />
        </ScrollView>
        <AlertView present={this.presentAlert} showFor={2000} style={styles.alertView} message={{devMessage}} messageStyle={styles.alertText}>
          <Text style={styles.alertText}>{devMessage}</Text>
        </AlertView>
      </View>
    );
  },

  renderAppItem: function(item) {
    var displayName = item.display_name ? item.display_name : item.name;
    return <AppThumbnailView name={displayName} appId={item.id} key={item.id}/>;
  },
});

module.exports = AppCollectionView;
