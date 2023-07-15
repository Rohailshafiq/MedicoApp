import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CheckBox } from 'react-native-elements';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../config/firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAppState } from '../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = (props) => {
  const state = useAppState()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const handleLogin = async () => {
    const auth = getAuth(app);
    const db = getFirestore();

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in!', user);

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'User data not found.');
      } else {
        const userData = querySnapshot.docs[0].data();
        console.log('User data:', userData);

        setIsLoading(false);
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));

        state.dispatch('STORE_USER', userData)

        //props.navigation.navigate('Dashboard', { user: userData });
      }
    } catch (error) {
      setIsLoading(false);
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'User not found. Please check your email and password.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (email.trim() === '') {
      setEmailError('Please enter your email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.trim() === '') {
      setPasswordError('Please enter your password');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleForgotPassword = async () => {
    // if (email.trim() === '') {
    //   Alert.alert('Error', 'Please enter your email');
    //   return;
    // }

    setIsModalVisible(true);
  };

  const handleResetPassword = async () => {
    if (forgotPasswordEmail.trim() === '') {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setIsLoading(true)
    setForgotPasswordEmail('')
    const auth = getAuth(app);

    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      Alert.alert('Email Sent', 'A password reset email has been sent to your email address.');
    } catch (error) {
      setIsLoading(false)
      Alert.alert('Error', 'Failed to send password reset email. Please try again later.');
    }
    setIsLoading(false)
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <AntDesign name="user" size={25} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <View style={styles.inputContainer1}>
        <AntDesign name="lock" size={25} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      <View style={styles.checkboxContainer}>
        <CheckBox
          title="Remember Me"
          checked={rememberMe}
          onPress={toggleRememberMe}
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxText}
          checkedColor="rgb(102,186,170)"
          uncheckedColor="rgb(102,186,170)"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Forgot Password?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email address"
              value={forgotPasswordEmail}
              onChangeText={setForgotPasswordEmail}
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleResetPassword}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.modalButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(102,186,170)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(102,186,170)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    paddingTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  button: {
    backgroundColor: 'rgb(102,186,170)',
    borderRadius: 22,
    paddingVertical: 15,
    marginBottom: 10,
    width: '60%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    marginLeft: 0,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'rgb(102,186,170)',
  },
  forgotPasswordText: {
    fontSize: 16,
    marginTop: 10,
    borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Adjust the width as needed
    alignSelf: 'center', // Center the modal horizontally
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(102,186,170)',
    marginBottom: 10,
    paddingVertical: 5,
  },
  modalButton: {
    backgroundColor: 'rgb(102,186,170)',
    borderRadius: 22,
    paddingVertical: 15,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
