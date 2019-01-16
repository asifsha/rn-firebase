import React from 'react';
import {
  StyleSheet, Text, View, Button,
  FlatList, ListView, ScrollView
} from 'react-native';
import * as firebaseApp from 'firebase';
import * as  firebaseconfig from './firebase.config';
import ListItem from './components/ListItem.js';
import styles from './Styles.js';

import { List } from 'react-native-paper';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    //console.error(firebaseconfig.Config);

    if (!firebaseApp.apps.length) {
      firebaseApp.initializeApp(firebaseconfig.Config);
    }
    this.tasksRef = firebaseApp.database().ref('/items');
    // const dataSource = new ListView.DataSource({
    //   rowHasChanged: (row1, row2) => row1 !== row2,
    // });
    const dataSource = [];
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
          key: child.key
        });
      });

      this.setState({
        dataSource: tasks
      });
    });
  }

  renderSeparator = () => {
    return (
        <View
            style={{
                width: '90%',
                height: 2,
                backgroundColor:'#FF4500'	
            }}
        >
            <View>
               
            </View>
        </View>
    )
}

  renderItem = ({ item, index }) => (

    <View style={{ flexDirection: 'row' }}>

            <View>
                <Text>
                    {item}
                </Text>
            </View>
        
        {this.renderSeparator()}

    </View>
)


  render() {
   console.log(this.state.dataSource);
    return (
      <View style={styles.container}>
        <Text>List from firebase</Text>
        <Text>ex</Text>
        <FlatList
          
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View>
                
                    <ScrollView horizontal={true}>
                        <Text style={styles.item}>{item.name}   </Text>
                    </ScrollView>
                
            </View>
        )}
        ItemSeparatorComponent={this.renderSeparator}
        
          
        />
        <Text></Text>
        
      </View>
    );
  }
}

{/* <View style={styles.container}>
        <Text>List from firebase</Text>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
        />
        <Text></Text>
        <List.Item
          title="First Item"
          description="Item description"
          left={props => <List.Icon {...props} icon="folder" />}
        />
      </View> */}