import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation, route }) => {
  const { user } = route?.params;
  console.log('User:', user);

  const items = [
    {
      title: 'APPOINTMENT',
      icon: <Icon name="calendar-today" size={40} color="white" />,
      path: 'Appointment',
    },
    {
      title: 'MEDICAL FOLDER',
      icon: <Icon name="create-new-folder" size={40} color="white" />,
      path: 'MedicalFolder'
    },
    {
      title: 'Search',
      icon: <Icon name="search" size={40} color="white" />,
      path: 'DoctorSearch',
    },
    {
      title: 'My DOCTORS',
      icon: <Fontisto name="doctor" size={40} color="white" />,
      path: 'MyDoctors'
    },
    {
      title: 'PROFILE',
      icon: <AntDesign name="user" size={40} color="white" />,
      path: 'Profile',
    },
    {
      title: 'LOG OUT',
      icon: <Icon name="logout" size={40} color="white" />,
    },
  ];

  const renderMenuItem = (item, index) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.path)}
      style={styles.square}
      key={index}
    >
      {item.icon}
      <Text style={{ color: 'white', fontSize: width * 0.05, fontWeight: '700' }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.topdiv}>
        <View>
          {user && (
            <>
              {user.fullName ? (
                <Text style={{ color: 'white', fontSize: width * 0.06 }}>
                  {user.fullName}
                </Text>
              ) : (
                <>
                  <Text style={{ color: 'white', fontSize: width * 0.06 }}>
                    {user.firstName} {user.lastName}
                  </Text>

                </>
              )}
              {user.code ? (
                <Text style={{ color: 'white', fontSize: width * 0.06 }}>
                  {user.code}
                </Text>
              ) : (
                <Text style={{ color: 'white', fontSize: width * 0.06 }}>
                  {user.cinc}
                </Text>
              )}
            </>
          )}
        </View>
      </View>
      <ScrollView>
        <View style={styles.container2}>{items.map(renderMenuItem)}</View>
      </ScrollView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topdiv: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(103,186,170)',
    height: width * 0.4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    color: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: width * 0.06,
    marginVertical: '1em',
    textAlign: 'center',
    color: 'white',
  },
  container2: {
    flex: 1,
    padding: 5,
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  square: {
    width: width * 0.4,
    height: width * 0.3,
    backgroundColor: 'rgb(103,186,170)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    margin: 3,
    fontSize: width * 0.05,
    textTransform: 'capitalize',
  },
});

export default Dashboard;
