const React = require('react-native')
const {StyleSheet} = React

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:20
  },
  listView: {
    flex: 1,
  },
  listItem: {
    borderBottomColor: '#eee',
    borderColor: 'gray',
    flexDirection:'row',
    alignItems:'center',
    borderWidth: 1,
    padding:20
  } ,
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
},
})

module.exports = styles
