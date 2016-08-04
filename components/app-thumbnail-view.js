/*
* Renders an app icon and title. To be used by the AppCollectionView
*/
'use strict';

var React = require('react-native');
var styles = require('../styles/app-thumbnail-view-styles');

var {
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = React;

var AppThumbnailView = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
  },

  getFortmattedAppName: function() {
    var formattedName;
    var appNameLength = 10;
    if (this.props.name.length > appNameLength) {
      formattedName = this.props.name.slice(0, appNameLength - 1) + '...';
    } else {
      formattedName = this.props.name;
    }

    return formattedName;
  },

  appPressed: function() {
    var appData = {
      name: this.props.name,
      appId: this.props.appId,
    };
    global.broker.emit('app:present', appData);
  },

  componentWillMount: function() {
    LayoutAnimation.spring();
  },

  render: function() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.appPressed} style={styles.icon}>
          <Image source={require('../assets/images/icon_bw.png')}
            style={styles.iconImage}
            resizeMode='contain'/>
        </TouchableOpacity>
        <Text style={styles.name}>{this.getFortmattedAppName()}</Text>
      </View>
    );
  },
});

module.exports = AppThumbnailView;
