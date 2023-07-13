import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
// import DoctorSearch from '../screens/DoctorSearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DoctorSearchScreen from '../screens/DoctorSearchScreen';
import MedicalFolder from '../screens/MedicalFolder'
import DoctorDetail from '../screens/DoctorDetail'
import ConfirmAppointment from '../screens/ConfirmAppointment'
import MyDoctors from '../screens/MyDoctors'

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ headerTitle: '' }} />
        <Stack.Screen name="DoctorSearch" component={DoctorSearchScreen} options={{ headerTitle: '' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MedicalFolder" component={MedicalFolder} />
        <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
        <Stack.Screen name="ConfirmAppointment" component={ConfirmAppointment} />
        <Stack.Screen name="MyDoctors" component={MyDoctors} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
