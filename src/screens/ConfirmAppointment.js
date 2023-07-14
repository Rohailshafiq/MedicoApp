import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getFirestore, collection, addDoc, setDoc, doc, up } from 'firebase/firestore';
import { app } from '../config/firebase';
import { getAuth, currentUser } from 'firebase/auth';


const BookAppointmentScreen = ({ route }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reason, setReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { doctorId } = route.params;

  const handleAppointmentBooking = async () => {
    try {
      setIsLoading(true);

      const auth = getAuth(app);
      const user = auth.currentUser;

      const appointmentData = {
        name,
        phoneNumber,
        reason,
        date: selectedDate,
        time: selectedTime,
        status: 'on Hold',
        userId: user.uid,
        doctorId: doctorId,
      };

      const db = getFirestore(app);
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      const appointmentId = docRef.id;

      // Update the appointment with the appointmentId
      const updatedAppointmentData = { ...appointmentData, appointmentId };
      await setDoc(doc(db, 'appointments', appointmentId), updatedAppointmentData);

      Alert.alert('Success', 'Appointment booked successfully!', [{ text: 'OK' }]);
    } catch (error) {
      console.log('Error storing appointment data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <MaterialIcons name="person" size={24} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.fieldContainer}>
        <MaterialIcons name="phone" size={24} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={styles.fieldContainer}>
        <MaterialIcons name="note" size={24} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Reason for Appointment"
          value={reason}
          onChangeText={setReason}
        />
      </View>
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Text style={styles.buttonText}>{selectedDate ? selectedDate.toDateString() : 'Select Date'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.timePickerButton} onPress={showTimePicker}>
        <Text style={styles.buttonText}>{selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAppointmentBooking}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Book Appointment</Text>
        )}
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(102, 186, 170)',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'rgb(102, 186, 170)',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    backgroundColor: 'rgb(102, 186, 170)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  timePickerButton: {
    backgroundColor: 'rgb(102, 186, 170)',
    borderRadius: 5,
    padding: 10,
  },
});

export default BookAppointmentScreen;
