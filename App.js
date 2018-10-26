import React from 'react';
import { StyleSheet, Text, View, Button,
  ListView } from 'react-native';
import * as firebaseApp from 'firebase';
import * as  firebaseconfig  from './firebase.config';
import ListItem from './components/ListItem.js';
import styles from './Styles.js';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    
    if (!firebaseApp.apps.length) {
      firebaseApp.initializeApp(firebaseconfig.Config);
  }
    this.tasksRef = firebaseApp.database().ref('/items');
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource: dataSource
    };
  }

  _renderItem(task) {
    return (
      <ListItem task={task} />
    );
  }
  componentDidMount() {
    // start listening for firebase updates
    this.listenForTasks(this.tasksRef);
  }  

  listenForTasks(tasksRef) {
    tasksRef.on('value', (dataSnapshot) => {
      var tasks = [];
      dataSnapshot.forEach((child) => {
        
        tasks.push({
          name: child.val().name,
          _key: child.key
        });
      });
  
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(tasks)
      });
    });
  }

  
  render() {
    return (
      <View style={styles.container}>
        <Text>List from firebase</Text>             
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
         />
        <Text></Text>
      </View>
    );
  }
}

