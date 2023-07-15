import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { app } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MedicalDescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
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
    fetchPrescriptions();
  }, []);


  const fetchPrescriptions = async () => {
    setLoading(true);

    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    console.log('cdcdcdcd', currentUser)

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userId = currentUser.uid;
    const db = getFirestore(app);

    // const prescriptionsRef = collection(db, 'prescriptions');
    // const q = query(prescriptionsRef, where('prescriptionId', '==', userId));
    const prescriptionsRef = collection(db, 'prescriptions');
    let q;

    if (user.accountType === 'doctor') {
      q = query(prescriptionsRef, where('prescriptionId', '==', userId));
    } else {
      q = query(prescriptionsRef, where('userId', '==', userId));
    }

    try {
      const querySnapshot = await getDocs(q);
      const prescriptionsData = querySnapshot.docs.map(doc => doc.data());
      setPrescriptions(prescriptionsData);
      console.log('Prescriptions data:', prescriptionsData);
    } catch (error) {
      console.log('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(102, 186, 170)" />
        </View>
      ) : (
        <ScrollView>
          {prescriptions.map((item, index) => {
            return (
              <TouchableOpacity key={index}>
                <View style={styles.outerContainer}>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>User: </Text>
                    <Text>{item.userName}</Text>
                  </View>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>Medicine: </Text>
                    <Text >{item.medicine}</Text>
                  </View>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>Prescription: </Text>

                    <Text>{item.prescription}</Text>
                  </View>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>Notes: </Text>

                    <Text >{item.notes}</Text>
                  </View>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>Morning: </Text>

                    <Text >{item.morning}</Text>
                  </View>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>Noon: </Text>

                    <Text >{item.noon}</Text>
                  </View>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>Evening: </Text>

                    <Text >{item.evening}</Text>
                  </View>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>Created At: </Text>

                    <Text >{formatTimestamp(item.createdAt)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

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
  text: { marginLeft: 2, color: 'black' },
  outerContainer: {
    padding: 15,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'rgb(103, 186, 170)',
    margin: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MedicalDescription;