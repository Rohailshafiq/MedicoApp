import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  AppState,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppState } from '../Context/AppContext';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation, route }) => {
  const state = useAppState()

  const [user, setUser] = React.useState('');
  console.warn('user', user);
  const getUser = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      const parsedUser = JSON.parse(currentUser);
      setUser(parsedUser);
    } catch (error) {
      console.log('error', error);
    }
  };
  console.warn('user is', user);
  useEffect(() => {
    getUser();
  }, []);
  const handleOnItemClick = async (item) => {
    console.warn('item.path', item.path)
    if (item.title === 'LOG OUT') {
      await AsyncStorage.removeItem('currentUser');
      state.dispatch('SIGN_OUT')
      navigation.navigate(item.path);
    } else {
      navigation.navigate(item.path, { currentUser: user });
    }
  }; items = [
    {
      title: 'APPOINTMENT',
      icon: <Icon name="calendar-today" size={40} color="white" />,
      path: 'Appointment',
    },
    {
      title: 'MEDICAL FOLDER',
      icon: <Icon name="create-new-folder" size={40} color="white" />,
      path: 'MedicalFolder',
    },
    {
      title: 'Search',
      icon: <Icon name="search" size={40} color="white" />,
      path: user?.accountType == 'doctor' ? 'PatientList' : 'DoctorSearch',
    },
    {
      title: user?.accountType === 'doctor' ? 'MY PATIENT' : 'My DOCTORS',
      icon: <Fontisto name={user?.accountType == "doctor" ? 'bed-patient' : 'doctor'} size={40} color="white" />,
      path: user?.accountType == 'doctor' ? 'MyPatient' : 'MyDoctors',
    },
    {
      title: 'PROFILE',
      icon: <AntDesign name="user" size={40} color="white" />,
      path: 'Profile',
    },
    {
      title: 'LOG OUT',
      icon: <Icon name="logout" size={40} color="white" />,
      path: 'Login',
    },
  ];

  const renderMenuItem = (item, index) => (
    <TouchableOpacity
      onPress={() => handleOnItemClick(item)}
      style={styles.square}
      key={index}>
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
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {user && (
            <>
              {user.fullName ? (
                <Text style={{ color: 'white', fontSize: width * 0.06 }}>
                  {user.fullName}
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      fontWeight: '700',
                      color: 'white',
                      fontSize: width * 0.06,
                      marginLeft: 30,
                    }}>
                    {user.firstName} {user.lastName}
                  </Text>
                </>
              )}
              {user.code ? (
                <Text style={{ color: 'white', fontSize: width * 0.06 }}>
                  {user.code}
                </Text>
              ) : (
                <Text
                  style={{
                    color: 'white',
                    fontSize: width * 0.06,
                    marginLeft: 30,
                  }}>
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