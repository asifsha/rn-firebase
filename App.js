import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as firebase from 'firebase';
import firebaseconfig from './firebase.config';

export default class App extends React.Component {

  onPressLearnMore(){    
   
   console.warn('config');
   //console.warn(firebaseConfig);

    firebase.initializeApp(firebaseconfig);
    console.warn('db connected');
    // firebase.database().ref('users/' + userId).set({
    //   highscore: score
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
              <Button
        onPress={this.onPressLearnMore}
        title="Connect DB"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
