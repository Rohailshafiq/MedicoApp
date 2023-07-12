import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { app } from '../config/firebase';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';





const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctorList, setDoctorList] = useState([]);
  const [specialtyList, setSpecialtyList] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const fetchDoctors = async () => {
    const db = getFirestore(app);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('accountType', '==', 'doctor'));

    try {
      const querySnapshot = await getDocs(q);
      const doctors = querySnapshot.docs.map((doc) => doc.data());
      setDoctorList(doctors);
    } catch (error) {
      console.log('Error fetching doctors:', error);
    }
  };

  const fetchSpecialties = async () => {
    const db = getFirestore(app);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('accountType', '==', 'doctor'));

    try {
      const querySnapshot = await getDocs(q);
      const specialties = [...new Set(querySnapshot.docs.map((doc) => doc.data().speciality))];
      setSpecialtyList(specialties);
    } catch (error) {
      console.log('Error fetching specialties:', error);
    }
  };

  const handleSearch = () => {
    // Perform search based on the searchText value
    console.log('Search:', searchText);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={24} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          placeholderTextColor="lightgrey"
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'doctors' && styles.activeTab]}
          onPress={() => handleTabChange('doctors')}
        >
          <Text style={styles.tabText}>Doctors</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'specialty' && styles.activeTab]}
          onPress={() => handleTabChange('specialty')}
        >
          <Text style={styles.tabText}>Specialty</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'doctors' && (
        <View style={styles.tabContent}>
          {doctorList.map((doctor) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 60, height: 60, borderRadius: 34, borderColor: 'rgb(102, 186, 170)', backgroundColor: 'white', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', fontSize: 24, color: 'rgb(102, 186, 170)' }}>A</Text>
                </View>
                <Text key={doctor.fullName} style={{ textAlign: 'center', paddingTop: 20, paddingLeft: 15, fontSize: 20, }}>{doctor.fullName}</Text>
              </View>
              <AntDesign name='infocirlceo' size={24} style={{ paddingTop: 10 }} />
            </View>

          ))}
        </View>
      )}

      {activeTab === 'specialty' && (
        <View style={styles.tabContent}>
          {specialtyList.map((specialty) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 60, height: 60, borderRadius: 34, borderColor: 'rgb(102, 186, 170)', backgroundColor: 'white', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', fontSize: 24, color: 'rgb(102, 186, 170)' }}>A</Text>
                </View>
                <Text key={specialty} style={{ textAlign: 'center', paddingTop: 20, paddingLeft: 15, fontSize: 20, }}>{specialty}</Text>
              </View>
              <Ionicons name='arrow-forward' size={28} style={{ paddingTop: 10 }} color='rgb(102, 186, 170)' />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(102, 186, 170)',
    //paddingHorizontal: 20,
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
});

export default SearchScreen;
