import React from 'react';
import {
  StyleSheet, Text, View,
  FlatList, TouchableWithoutFeedback, ScrollView
} from 'react-native';
import * as firebaseApp from 'firebase';
import {
  TextInput, Button, Snackbar,
  Portal, Dialog, Paragraph,
  Provider as PaperProvider
} from 'react-native-paper';


import * as  firebaseconfig from './firebase.config';
import ListItem from './components/ListItem.js';
import { Platform } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

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
      selecteditem: null,
      snackbarVisible: false,
      confirmVisible: false
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

  deleteItem(item){
  this.setState({deleteItem: item, confirmVisible: true});
  
  }

  performDeleteItem(key) {

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

  addItem(itemName) {

    var newPostKey = firebaseApp.database().ref().child('items').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/items/' + newPostKey] = { name: itemName === '' || itemName == undefined ? this.state.itemname : itemName };


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

    this.setState({ itemname: '', selecteditem: null })
  }

  hideDialog(yesNo) {
    this.setState({ confirmVisible: false });
    if(yesNo === true)
    {
      this.performDeleteItem(this.state.deleteItem.key).then(()=>{
        this.setState({snackbarVisible:true});
      });
    }
  }

  showDialog() {
    this.setState({ confirmVisible: true });
    console.log('in show dialog');
  }

  undoDeleteItem()
  {
  
    this.addItem(this.state.deleteItem.name);
  }
  //hideDialog = () => this.setState({ confirmVisible: false });


  render() {
    return (
      <PaperProvider>
      <View style={styles.container}>
        <ScrollView>
          <Text>List from firebase</Text>
          <TextInput
            label='City'
            style={{ height: 50, width: 250, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(text) => this.setState({ itemname: text })}
            value={this.state.itemname}
          />
          <TouchableWithoutFeedback >
            <View>
              <Text style={{ padding: 10 }} onPress={() => this.saveItem()} >{this.state.selecteditem === null ? 'add' : 'update'}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Button icon={this.state.selecteditem === null ? 'add' : 'update'} mode="contained" onPress={() => this.saveItem()}>
            {this.state.selecteditem === null ? 'add' : 'update'}
          </Button>
          <FlatList

            data={this.state.dataSource}
            renderItem={({ item }) => (
              <View>

                <ScrollView horizontal={true}>
                  <TouchableWithoutFeedback >
                    <View style={{ paddingTop: 10 }}>
                      <Text style={{ color: '#FF4500' }} onPress={() => this.deleteItem(item)} >
                        <Ionicons name="md-trash" size={20} />
                      </Text>
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

          <Snackbar
            visible={this.state.snackbarVisible}
            onDismiss={() => this.setState({ snackbarVisible: false })}
            action={{
              label: 'Undo',
              onPress: () => {
                // Do something
                this.undoDeleteItem();
              },
            }}
          >
            Item deleted successfully.
        </Snackbar>
          <Button onPress={() => this.showDialog()}>Show Dialog</Button>
          <Portal>
            <Dialog
              visible={this.state.confirmVisible}
              onDismiss={() => this.hideDialog(false)}>
              <Dialog.Title>Confirm</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Are you sure you want to delete this?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => this.hideDialog(true)}>Yes</Button>
                <Button onPress={() => this.hideDialog(false)}>No</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ScrollView>
      </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 38 : 22,
    alignItems: 'center',
    backgroundColor: '#FFFFE0'
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