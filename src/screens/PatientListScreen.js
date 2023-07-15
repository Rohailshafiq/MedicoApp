import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { app } from '../config/firebase';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = props => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);


  useEffect(() => {
    fetchAppointments();
  }, []);


  const fetchAppointments = async () => {
    setLoading(true);

    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;

    const db = getFirestore(app);
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('doctorId', '==', userId));

    try {
      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map((doc) => doc.data());

      const uniqueDoctorIds = Array.from(new Set(appointmentsData.map((appointment) => appointment.userId)));

      const doctorsRef = collection(db, 'users');
      const doctorsQuery = query(doctorsRef, where('patientId', 'in', uniqueDoctorIds));
      const doctorsSnapshot = await getDocs(doctorsQuery);

      const doctorsData = doctorsSnapshot.docs.reduce((acc, doc) => {
        const doctorData = doc.data();
        acc[doctorData.patientId] = doctorData;
        return acc;
      }, {});

      const appointmentsWithDoctors = uniqueDoctorIds.map((doctorId) => {
        const appointment = appointmentsData.find((appointment) => appointment.userId === doctorId);
        return {
          ...appointment,
          doctor: doctorsData[doctorId],
        };
      });

      setAppointments(appointmentsWithDoctors);
      console.log('Appointments data:', appointments);
    } catch (error) {
      console.log('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchText === "") {
      setAppointments(appointments);
    } else {
      const filteredData = appointments.filter(
        (item) => item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      );
      setAppointments(filteredData);
    }
  };

  const renderItem = ({ item }) => {
    console.log('cccccccccc', JSON.stringify(item, null, 2));
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 6 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 60, height: 60, borderRadius: 34, borderColor: 'rgb(102, 186, 170)', backgroundColor: 'white', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 24, color: 'rgb(102, 186, 170)' }}>{item.name.charAt(0)}</Text>
          </View>
          <Text key={item.name} style={{ textAlign: 'center', paddingTop: 20, paddingLeft: 15, fontSize: 20, }}>{item.name}</Text>
        </View>
        <TouchableOpacity onPress={() => props.navigation.navigate('PatientDetail', { item })}>
          <AntDesign name='infocirlceo' size={24} style={{ paddingTop: 10 }} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={24} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            if (text.trim() === '') {
              fetchAppointments()
            }
          }}
          onSubmitEditing={handleSearch}
          placeholderTextColor="lightgrey"
        />
      </View>


      <>
        <View style={styles.tabContent}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 6,
            }}>
            {loading ?
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(102, 186, 170)" />
              </View> : <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.noDataText}>No appointments found.</Text>
                }
                ItemSeparatorComponent={renderSeparator}
              />}
          </View>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(102, 186, 170)',
    //paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    width: '100%',
    // Customize the separator color here
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'black',
    marginLeft: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'white',
  },
  searchIcon: {
    left: 15,
    color: 'grey',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    backgroundColor: 'rgb(102, 186, 170)',
    borderRadius: 5,
  },
  listContainer: {
    //paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    //borderBottomWidth: 1,
    //borderBottomColor: '#fff',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContent: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderBottomWidth: 2,
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

export default SearchScreen;