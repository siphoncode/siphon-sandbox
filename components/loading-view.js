/*
* Loading view
*/
'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  LayoutAnimation,
} = React;

var LoadingView = React.createClass({

  render: function() {
    return (
      <View style={styles.container}/>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  spinner: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

module.exports = LoadingView;
