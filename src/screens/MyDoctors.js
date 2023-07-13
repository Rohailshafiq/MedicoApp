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
  ActivityIndicator,
} from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { app } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const MyDoctors = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true); // Start the loading indicator

    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;

    const db = getFirestore(app);
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('userId', '==', userId)
    );

    try {
      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map((doc) => doc.data());

      const doctorIds = appointmentsData.map((appointment) => appointment.doctorId);
      const doctorsRef = collection(db, 'users');
      const doctorsQuery = query(doctorsRef, where('doctorId', 'in', doctorIds));
      const doctorsSnapshot = await getDocs(doctorsQuery);

      const doctorsData = doctorsSnapshot.docs.reduce((acc, doc) => {
        const doctorData = doc.data();
        acc[doctorData.doctorId] = doctorData;
        return acc;
      }, {});

      const appointmentsWithDoctor = appointmentsData.map((appointment) => ({
        ...appointment,
        doctor: doctorsData[appointment.doctorId],
      }));

      setAppointments(appointmentsWithDoctor);
      console.log('Appointments data:', appointmentsWithDoctor); // Log the retrieved data
    } catch (error) {
      console.log('Error fetching appointments:', error);
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <View style={styles.iconContainer}>
            <Icon name="user" size={24} color="#333" style={styles.icon} />
          </View>
          <Text style={styles.itemName}>{item.doctor.fullName}</Text>
        </View>
        <View style={styles.itemDetails}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Icon name="phone" size={16} color="#777" style={styles.icon} />
            </View>
            <Text style={styles.itemPhone}>{item.doctor.phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Icon name="map-marker" size={16} color="#777" style={styles.icon} />
            </View>
            <Text style={styles.itemReason}>{item.doctor.address}</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Icon name="star" size={16} color="#777" style={styles.icon} />
            </View>
            <Text style={styles.itemReason}>{item.doctor.speciality}</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Icon name="dollar" size={16} color="#777" style={styles.icon} />
            </View>
            <Text style={styles.itemReason}>2000 PKR</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(102, 186, 170)" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
    borderColor: 'rgb(102, 186, 170)',
    borderWidth: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 10,
    width: 24,
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPhone: {
    fontSize: 16,
    color: '#777',
  },
  itemReason: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MyDoctors;
