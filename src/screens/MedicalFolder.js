import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const MedicalDescription = () => {
  const perception = [
    {
      name: 'sardar jalil',
      pressure: 1.5,
      sugar: 34.5,
      logedIn: '27/10/2023 8:10AM',
    },
    {
      name: 'Rohail Shafique',
      pressure: 1.5,
      sugar: 33.5,
      logedIn: '21/10/2023 9:40AM',
    },
    {
      name: 'Qalab Hasnain',
      pressure: 5.4,
      sugar: 36.5,
      logedIn: '29/10/2023 1:30AM',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView>
        {perception.map((item, index) => {
          return (
            <TouchableOpacity key={index}>
              <View style={styles.outerContainer}>
                <View style={styles.innerContainer}>
                  <Text>User:</Text>
                  <Text style={styles.text}>{item.name}</Text>
                </View>
                <View style={styles.innerContainer}>
                  <Text>Pressure:</Text>
                  <Text style={styles.text}>{item.pressure}</Text>
                </View>
                <View style={styles.innerContainer}>
                  <Text>Sugar:</Text>
                  <Text style={styles.text}>{item.sugar}</Text>
                </View>
                <View style={styles.innerContainer}>
                  <Text>Loged On:</Text>
                  <Text style={styles.text}>{item.logedIn}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  innerContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  text: { marginLeft: 2 },
  outerContainer: {
    padding: 15,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'gray',
    margin: 4,
  },
});
export default MedicalDescription;