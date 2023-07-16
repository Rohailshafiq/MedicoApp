import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = () => {
  const { confirmPaymentMethod } = useStripe();
  const [paymentMethod, setPaymentMethod] = useState(null);

  const publishableKey = 'pk_test_51NTA88GBSrfpNSXfoNLRSBwSpYYimjjEPFTFH7V5rUqgDugweF8lvy3oidn96ebqXrwduwhva82V6e1Kn17OLazq00e2EH8qVa'; // Replace with your Stripe publishable key

  useEffect(() => {
    // Initialize Stripe when component mounts
    initStripe();
  }, []);

  const initStripe = async () => {
    await confirmPaymentMethod({
      publishableKey,
    });
  };

  const handlePaymentMethodCreate = async () => {
    const { error, paymentMethod } = await confirmPaymentMethod({
      type: 'Card',
      billingDetails: {
        email: 'test@example.com',
      },
    });

    if (error) {
      console.log('Payment failed:', error);
      // Handle payment failure
    } else if (paymentMethod) {
      console.log('Payment succeeded:', paymentMethod);
      // Handle successful payment
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Screen</Text>

      <CardField
        postalCodeEnabled={true}
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

      <TouchableOpacity style={styles.button} onPress={handlePaymentMethodCreate}>
        <Text style={styles.buttonText}>Submit Payment</Text>
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
    backgroundColor: 'blue',
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
