import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { app } from '../config/firebase';

const AddPrescription = ({ route, navigation }) => {
  const { prescriptionId, userName, userId } = route?.params;
  console.log('prescriptionId', prescriptionId, userName, userId)
  const [medicine, setMedicine] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [morning, setMorning] = useState('');
  const [noon, setNoon] = useState('');
  const [evening, setEvening] = useState('');
  const [loading, setLoading] = useState(false)

  const handleAddPrescription = async () => {
    setLoading(true)
    const db = getFirestore(app);
    const prescriptionsRef = collection(db, 'prescriptions');

    try {
      await addDoc(prescriptionsRef, {
        prescriptionId,
        userName,
        userId,
        medicine,
        prescription,
        notes,
        morning,
        noon,
        evening,
        createdAt: serverTimestamp(),
      });
      setLoading(false)
      // Reset the form after successful submission
      setMedicine('');
      setPrescription('');
      setNotes('');
      setMorning('');
      setNoon('');
      setEvening('');
      Alert.alert('Success', 'Prescription added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to the dashboard screen
            navigation.navigate('Dashboard');
          },
        },
      ]);
      // Show success message or navigate back to the previous screen
      console.log('Prescription added successfully!');
    } catch (error) {
      setLoading(false)
      console.log('Error adding prescription:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Medicine"
        value={medicine}
        onChangeText={setMedicine}
      />
      <TextInput
        style={styles.input}
        placeholder="Prescription"
        value={prescription}
        onChangeText={setPrescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
      />
      <TextInput
        style={styles.input}
        placeholder="Morning"
        value={morning}
        onChangeText={setMorning}
      />
      <TextInput
        style={styles.input}
        placeholder="Noon"
        value={noon}
        onChangeText={setNoon}
      />
      <TextInput
        style={styles.input}
        placeholder="Evening"
        value={evening}
        onChangeText={setEvening}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddPrescription}>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Add Prescription</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: 'rgb(103, 186, 170)',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddPrescription;
