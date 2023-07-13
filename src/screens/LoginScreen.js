import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CheckBox } from 'react-native-elements';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../config/firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const LoginScreen = (props) => {
  const [email, setEmail] = useState('rohailshafiq99@gmail.com');
  const [password, setPassword] = useState('abcd1234A#');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

        props.navigation.navigate('Dashboard', { user: userData });
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
    backgroundColor: 'white'
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
    paddingTop: 10
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
    paddingLeft: 10
  },
  button: {
    backgroundColor: 'rgb(102,186,170)',
    borderRadius: 22,
    paddingVertical: 15,
    marginBottom: 10,
    width: '60%'

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
    paddingLeft: 10
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
    color: 'rgb(102,186,170)'
  },
});

export default LoginScreen;
