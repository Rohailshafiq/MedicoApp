import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { width } = Dimensions.get('window');

const Appointments = () => {
  const menuItem = ['On Hold', 'Accepted', 'Declined'];
  const [selectedTab, setSelectedTab] = React.useState('On Hold');

  const renderMenuItem = (item, index) => (
    <TouchableOpacity
      onPress={() => setSelectedTab(item)}
      key={index}
      style={styles.menuItem}>
      <Text style={styles.menuItemText}>{item.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.topdiv}>
        <View style={styles.menuBox}>
          <Text
            style={{
              marginBottom: 20,
              color: 'white',
              fontSize: 30,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            Appointments
          </Text>
          <View style={styles.menuContainer}>
            {menuItem.map(renderMenuItem)}
          </View>
        </View>
      </View>
      <View>
        <Text>{selectedTab}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topdiv: {
    padding: 10,
    backgroundColor: 'rgb(103,186,170)',
    height: width * 0.4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    color: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  menuBox: {
    width: '100%',
  },
  menuItemText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 10,
    textTransform: 'capitalize',
  },
});

export default Appointments;