import React from 'react';
import {
  StyleSheet, Text, View, Button, TextInput,
  FlatList, TouchableWithoutFeedback, ScrollView
} from 'react-native';
import * as firebaseApp from 'firebase';


import * as  firebaseconfig from './firebase.config';
import ListItem from './components/ListItem.js';
import { Platform } from 'react-native';

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
      dataSource: dataSource,
      selecteditem: null
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
          backgroundColor: '#BBB5B3'
        }}
      >
        <View>

        </View>
      </View>
    )
  }

  deleteItem(key) {

    var updates = {};
    updates['/items/' + key] = null;
    return firebaseApp.database().ref().update(updates);
    //     var ref = firebaseApp.database().ref("items");
    // ref.orderByChild("key").equalTo(key).on("child_added", function(snapshot) {
    //   console.log(snapshot.key);

    // });

    //     firebaseApp.database().ref('items').delete(key).then(() => {
    //       console.log("Item successfully deleted!");

    //     }).catch((error) => {
    //       console.error("Error removing item: ", error);

    //     });
  }

  addItem() {

    var newPostKey = firebaseApp.database().ref().child('items').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/items/' + newPostKey] = { name: this.state.itemname };


    return firebaseApp.database().ref().update(updates);
    // firebaseApp.firestore().collection('items').add({
    //   name: this.state.itemname
    // }).then(() => {
    //   console.log("Item added successfully");
    // }
    // ).catch((error) => {
    //   console.error("Error adding item: ", error);
    // });
  }

  updateItem() {



    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/items/' + this.state.selecteditem.key] = { name: this.state.itemname };


    return firebaseApp.database().ref().update(updates);
    // firebaseApp.firestore().collection('items').add({
    //   name: this.state.itemname
    // }).then(() => {
    //   console.log("Item added successfully");
    // }
    // ).catch((error) => {
    //   console.error("Error adding item: ", error);
    // });
  }

  saveItem() {
    if (this.state.selecteditem === null)
      this.addItem();
    else
      this.updateItem();
  }


  render() {
    console.log(this.state.dataSource);
    return (
      <View style={styles.container}>
        <Text>List from firebase</Text>
        <TextInput
          style={{ height: 40, width: 250, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({ itemname: text })}
          value={this.state.itemname}
        />
        <TouchableWithoutFeedback >
          <View>
            <Text style={{ padding: 10 }} onPress={() => this.saveItem()} >{this.state.selecteditem === null ? 'add' : 'update'}</Text>
          </View>
        </TouchableWithoutFeedback>
        <FlatList

          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View>

              <ScrollView horizontal={true}>
                <TouchableWithoutFeedback >
                  <View>
                    <Text style={{ color: '#FF4500' }} onPress={() => this.deleteItem(item.key)} >{'X'}</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.setState({ selecteditem: item, itemname: item.name })}>
                  <View>
                    <Text style={styles.item}>{item.name}   </Text>
                  </View>
                </TouchableWithoutFeedback>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 38 : 22,
    alignItems: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    alignItems: 'center',
  }
});

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