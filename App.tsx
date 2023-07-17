import React, {useEffect} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StripeProvider} from '@stripe/stripe-react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SplashScreen from './src/screens/SplashScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DoctorSearchScreen from './src/screens/DoctorSearchScreen';
import MedicalFolder from './src/screens/MedicalFolder';
import PatientListScreen from './src/screens/PatientListScreen';
import AppContextProvider, {useAppState} from './src/Context/AppContext';
import DoctorDetail from './src/screens/DoctorDetail';
import ConfirmAppointment from './src/screens/ConfirmAppointment';
import MyDoctors from './src/screens/MyDoctors';
import MyPatient from './src/screens/MyPatient';
import AddPrescription from './src/screens/AddPrescription';
import PatientDetail from './src/screens/PatientDetail';
import Payment from './src/screens/Payment';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

const MainNavigation = () => {
  const [currentUser, setCurrentUser] = React.useState('');
  const state = useAppState();

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('currentUser');
      if (user) {
        let parseUser = JSON.parse(user);
        state.dispatch('STORE_USER', parseUser);
        setCurrentUser(parseUser);
      } else state.dispatch('LOADER_OFF');
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Stack.Navigator>
      {state?.userStateConfig?.isLoading ? (
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      ) : state?.userStateConfig?.user === null ? (
        <Stack.Screen
          name="Login"
          component={PrivateRoute}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen
          name="Dashboard"
          component={PublicRoute}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};

const PublicRoute = () => {
  return (
    <MainStack.Navigator initialRouteName="Dashboard">
      <MainStack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Appointment"
        component={AppointmentScreen}
        options={{headerTitle: ''}}
      />
      <MainStack.Screen
        name="DoctorSearch"
        component={DoctorSearchScreen}
        options={{headerTitle: ''}}
      />
      <MainStack.Screen
        name="PatientList"
        component={PatientListScreen}
        options={{headerTitle: ''}}
      />
      <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
      <Stack.Screen name="ConfirmAppointment" component={ConfirmAppointment} />
      <Stack.Screen name="MyDoctors" component={MyDoctors} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="MedicalFolder" component={MedicalFolder} />
      <MainStack.Screen name="MyPatient" component={MyPatient} />
      <MainStack.Screen name="AddPrescription" component={AddPrescription} />
      <MainStack.Screen name="PatientDetail" component={PatientDetail} />
      <MainStack.Screen name="Payment" component={Payment} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
    </MainStack.Navigator>
  );
};

const PrivateRoute = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen name="Register" component={RegistrationScreen} />
    </AuthStack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <StripeProvider publishableKey="pk_test_51NTA88GBSrfpNSXfoNLRSBwSpYYimjjEPFTFH7V5rUqgDugweF8lvy3oidn96ebqXrwduwhva82V6e1Kn17OLazq00e2EH8qVa">
        <AppContextProvider>
          <MainNavigation />
        </AppContextProvider>
      </StripeProvider>
    </NavigationContainer>
  );
};

export default App;
