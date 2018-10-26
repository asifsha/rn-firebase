import React, {
    Component
  } from 'react';
  import {
    View,
    Text
  } from 'react-native';
  import styles from '../Styles.js';
  
  class ListItem extends Component {
    render() {
      return (
        <View style={styles.listItem}>
          <Text>{this.props.task.name}</Text>
        </View>
      );
    }
  }
  
  module.exports = ListItem;