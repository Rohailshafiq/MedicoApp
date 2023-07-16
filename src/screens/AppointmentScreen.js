import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { app } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Appointments = (props) => {
  const menuItem = ['on Hold', 'Accepted', 'Declined'];
  const [selectedTab, setSelectedTab] = useState("on Hold");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = React.useState('');
  const getUsers = async () => {
    try {
      const cUser = await AsyncStorage.getItem('currentUser');
      let parseUser = JSON.parse(cUser);
      setUser(parseUser);
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    fetchAppointments(); // Fetch appointments whenever selectedTab changes
  }, [selectedTab]);


  const fetchAppointments = async () => {
    setLoading(true); // Start the loading indicator

    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setLoading(false); // Stop the loading indicator
      return; // Return early if there is no authenticated user
    }

    const userId = currentUser.uid;
    const db = getFirestore(app);
    const appointmentsRef = collection(db, 'appointments');
    let q = query(appointmentsRef, where('status', '==', selectedTab));

    if (user.accountType === 'doctor') {
      q = query(q, where('doctorId', '==', userId));
    } else {
      q = query(q, where('userId', '==', userId));
    }

    try {
      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map(doc => doc.data());
      setAppointments(appointmentsData);
      console.log('Appointments data:', appointmentsData); // Log the retrieved data
    } catch (error) {
      console.log('Error fetching appointments:', error);
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    console.log('appointmentId, newStatus', appointmentId, newStatus);
    try {
      setLoading(true); // Start the loading indicator
      const db = getFirestore(app);
      const appointmentRef = doc(db, 'appointments', appointmentId);

      await updateDoc(appointmentRef, {
        status: newStatus,
      });
      Alert.alert('Success', 'Appointment status updated successfully!', [{ text: 'OK' }]);

      // Remove the updated appointment from the appointments array
      setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.appointmentId !== appointmentId));
    } catch (error) {
      setLoading(false); // Stop the loading indicator
      console.log('Error updating appointment status:', error);
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  const handlePayment = (appointmentId) => {
    props.navigation.navigate('Payment', { appointmentId })
  };

  const renderItem = ({ item }) => {
    const appointmentDate = item.date.toDate();
    const formattedDate = appointmentDate.toLocaleDateString();
    const formattedTime = appointmentDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDate}>Date: {formattedDate}</Text>
          <Text style={styles.itemTime}>Time: {formattedTime}</Text>
          <Text style={styles.itemPhone}>Phone: {item.phoneNumber}</Text>
          <Text style={styles.itemReason}>Reason: {item.reason}</Text>
          <Text style={styles.itemReason}>Fee: 2000</Text>
          {item.status === 'Accepted' && user.accountType !== 'doctor' && item.paymentStatus !== 'payment done' && (
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={() => handlePayment(item.appointmentId)}>
              <Text style={styles.paymentButtonText}>Pay Fee</Text>
            </TouchableOpacity>
          )}
          {user.accountType == 'doctor' && item.status === 'on Hold' ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() =>
                  updateAppointmentStatus(item.appointmentId, 'Accepted')
                }
                style={styles.acceptedBtn}>
                <Text style={styles.buttonText}>Accepted</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  updateAppointmentStatus(item.appointmentId, 'Declined')
                }
                style={styles.declineBtn}>
                <Text style={styles.buttonText}>Declined</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.topdiv}>
        <View style={styles.menuBox}>
          <Text style={styles.title}>Appointments</Text>
          <View style={styles.menuContainer}>
            {menuItem.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTab(item)}>
                <Text
                  style={[
                    styles.menuItemText,
                    selectedTab === item && styles.selectedMenuItem,
                  ]}>
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(102, 186, 170)" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.noDataText}>No appointments found.</Text>
          }
        />
      )}
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
  title: {
    marginBottom: 20,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  selectedMenuItem: {
    alignItems: 'center',
    fontWeight: '900',
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
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(103,186,170)',
  },
  itemDetails: {},
  itemDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemTime: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemPhone: {
    fontSize: 16,
    color: '#777',
  },
  paymentButton: {
    backgroundColor: 'rgb(102, 186, 170)',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: 120,
    borderRadius: 7,
    margin: 3,
  },
  acceptedBtn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: 120,
    borderRadius: 7,
  },
  declineBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: 120,
    borderRadius: 7,
    marginLeft: 3,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Appointments;