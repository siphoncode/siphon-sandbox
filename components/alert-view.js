'use strict';

var React = require('react-native');
var Device = require('../utils/device-utils');
var {
  Animated,
  View,
  Text,
} = React;

var AlertView = React.createClass({
  propTypes: {
    present: React.PropTypes.bool,
    showFor: React.PropTypes.number.isRequired,
  },

  getInitialState: function() {
    return {hidden: true, fadeAnim: new Animated.Value(0)};
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.present && (nextProps.children != this.props.children)) {
      this.startTimer();
      this.setState({hidden: false});
      Animated.timing(
        this.state.fadeAnim,
        {toValue: 1}
      ).start();
    }
  },

  startTimer: function() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(function() {
      Animated.sequence([
        Animated.timing(
          this.state.fadeAnim,
          {toValue: 0, duration: 250}
        ),
      ]).start(()=> this.setState({hidden: true}));
      this.timer = null;
    }.bind(this), this.props.showFor);
  },

  componentWillUnmount: function() {
    clearTimeout(this.timer);
  },

  render: function() {
    var alertView;
    var hidden;
    if (this.state.hidden) {
      hidden = {height: 0};
    } else {
      hidden = {};
    }
    alertView = <Animated.View style={[this.props.style, hidden, {
      opacity: this.state.fadeAnim,
    }]}>{this.props.children}</Animated.View>;
    return (
      alertView
    );
  },
});

module.exports = AlertView;
