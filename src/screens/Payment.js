import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { app } from '../config/firebase';

const PaymentScreen = ({ route, navigation }) => {
  const { confirmPaymentMethod } = useStripe();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const { appointmentId } = route.params;

  const publishableKey =
    'pk_test_51NTA88GBSrfpNSXfoNLRSBwSpYYimjjEPFTFH7V5rUqgDugweF8lvy3oidn96ebqXrwduwhva82V6e1Kn17OLazq00e2EH8qVa'; // Replace with your Stripe publishable key

  const updateAppointmentStatus = async () => {
    try {
      setLoading(true); // Start the loading indicator
      const db = getFirestore(app);
      const appointmentRef = doc(db, 'appointments', appointmentId);

      await updateDoc(appointmentRef, {
        paymentStatus: 'payment done',
      });

      Alert.alert('Success', 'Fee paid successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);
    } catch (error) {
      console.log('Error updating appointment status:', error);
      Alert.alert('Error', 'Failed to update payment status.', [{ text: 'OK' }]);
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>

      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={styles.cardField}
        onCardChange={(cardDetails) => {
          // Handle card details change
        }}
        onFocus={(focusedField) => {
          // Handle field focus
        }}
      />
      <View style={{ alignSelf: 'flex-end' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Total Fee: 2000</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={updateAppointmentStatus}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'rgb(102, 186, 170)',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
