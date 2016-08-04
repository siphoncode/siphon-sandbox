/*
* A login form that communicates with a provided REST api
*/
'use strict';

var constants = require('../sandbox-constants');
var styles = require('../styles/login-view-styles');

var React = require('react-native');
var dismissKeyboard = require('dismissKeyboard');
var request = require('superagent');
var _ = require('underscore');

var {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  RefreshControl,
  ScrollView,
  ActivityIndicatorIOS,
  LayoutAnimation,
  Platform,
  ProgressBarAndroid,
  StatusBar,
  NativeModules,
} = React;

var API = require('../utils/api-utils');

var Mixpanel = NativeModules.RNMixpanelManager;

var LoginView = React.createClass({
  componentWillMount() {
    if (Platform.OS == 'ios') {
      StatusBar.setBarStyle('default', true);
    } else {
      StatusBar.setBackgroundColor('black', true);
    }

    LayoutAnimation.spring();
  },

  getInitialState: function() {
    return {
      loading: false,
      message: '',
    };
  },

  _getLoginErrorMessage: function(obj) {
    // Takes a response object and returns the pertintent error message.
    var keys = _.keys(obj);
    var message = '';

    _.each(keys, function(key) {
      message = message + (obj[key] + '\n');
    });

    return message;
  },

  _submitCredentials: function(uname, pword) {

    var url = constants.API_URL + 'accounts/login/';
    var data = {username: uname, password: pword};

    var _this = this;

    request
      .post(url)
      .send({username: uname, password: pword})
      .set('Content-Type', 'application/json')
      .accept('application/json')
      .on('error', function(err) {
        _this.setState({message: 'An error occurred.'});
        _this.setState({loading: false});
        Mixpanel.track('Sandbox: Log in failed');
      })
      .end(function(error, response) {

        if (error && error.status === 400) {
          var obj = JSON.parse(response.text);
          var errorMsg = _this._getLoginErrorMessage(obj);
          _this.setState({message: errorMsg});
          _this.setState({loading: false});

          Mixpanel.trackWithProperties('Sandbox: Log in failed', {error: errorMsg});
        } else if (response && response.ok) {
          var token = JSON.parse(response.text).token;

          // Set the global auth token here so we can retrieve the account
          // details for mixpanel tracking
          global.AUTH_TOKEN = token;

          API.getAccountInfo()
            .then((info) => {
              var username = info.username;

              // Mixpanel tracking
              Mixpanel.registerSuperProperties({user: username}); // persisted to disk
              Mixpanel.identify(username); // persisted to disk
              Mixpanel.track('Sandbox: User logged in');
              // The user has been authenticated
              global.broker.emit('auth:success', token);
            });
        } else {
          var msg = 'An error occurred. Make sure you are connected to the ' +
                    'internet and try again.';
          _this.setState({message: msg});
          _this.setState({loading: false});
        }
      });
  },

  loginUser: function(event) {
    dismissKeyboard();
    this.setState({loading: true});
    this.setState({message: ''});

    var username = this.state.username;
    var password = this.state.password;

    if (!username) {
      this.setState({message: 'Username or email required.'});
      this.setState({loading: false});
      return;
    } else if (!password) {
      this.setState({message: 'Password required.'});
      this.setState({loading: false});
      return;
    } else {
      this._submitCredentials(username, password);
    }
  },

  render: function() {
    var lol;
    var spinner;
    if (Platform.OS === 'ios') {
      spinner = <ActivityIndicatorIOS style={styles.spinner}
        animating={this.state.loading}
        color='white'/>;
    } else {
      if (this.state.loading) {
        spinner = <ProgressBarAndroid style={styles.spinner}
          indeterminate={true}
          color='white'
          styleAttr="Small"/>;
      }
    }
    return (
      <ScrollView contentContainerStyle={styles.container}
      scrollEnabled={false}
      keyboardShouldPersistTaps={false}>
        <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode='contain'/>
        </View>
        <View style={styles.formContainer}>
          {/* Email/Username input */}
          <TextInput style={[styles.formItem, styles.textInput]}
            placeholder='Username or email'
            keyboardType='email-address'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(username) => this.setState({username})}
          />
          {/* Password input */}
          <TextInput style={[styles.formItem, styles.textInput]}
            secureTextEntry={true}
            placeholder='Password'
            onChangeText={(password) => this.setState({password})}
          />
          {/* Submit login button */}
          <TouchableHighlight style={[styles.formItem, styles.button]}
            underlayColor='#4c728c'
            onPress={this.loginUser}>
            <View>
              {/* Contains the button text and spinner */}
              <Text style={styles.buttonText}>Log in</Text>
              {spinner}
            </View>
          </TouchableHighlight>
          {/* Logging */}
          <Text style={styles.message}>{this.state.message}</Text>
        </View>
        <Text style={styles.versionMessage}>
          Powered by React Native v0.22.2
        </Text>
      </ScrollView>
    );
  },
});

module.exports = LoginView;
