import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { app } from '../config/firebase'; // Import the Firebase app instance

const RegisterScreen = (props) => {
  const [accountType, setAccountType] = useState('patient');
  const [isLoading, setIsLoading] = useState(false); // New state variable for loader

  // Patient fields
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientBirthDate, setPatientBirthDate] = useState('');
  const [patientPhoneNumber, setPatientPhoneNumber] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientCinc, setPatientCinc] = useState('');
  const [patientMaritalStatus, setPatientMaritalStatus] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [patientConfirmPassword, setPatientConfirmPassword] = useState('');

  // Doctor fields
  const [doctorFullName, setDoctorFullName] = useState('');
  const [doctorCode, setDoctorCode] = useState('');
  const [doctorPhoneNumber, setDoctorPhoneNumber] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorCity, setDoctorCity] = useState('');
  const [doctorAddress, setDoctorAddress] = useState('');
  const [doctorSpeciality, setDoctorSpeciality] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');
  const [doctorConfirmPassword, setDoctorConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    const validationErrors = validateInputs();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true); // Show loader

    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      let email, password;

      if (accountType === 'patient') {
        email = patientEmail;
        password = patientPassword;
      } else if (accountType === 'doctor') {
        email = doctorEmail;
        password = doctorPassword;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Registered!', user.uid);
      let userData;

      if (accountType === 'patient') {
        userData = {
          firstName: patientFirstName,
          lastName: patientLastName,
          birthDate: patientBirthDate,
          phoneNumber: patientPhoneNumber,
          email: patientEmail,
          cinc: patientCinc,
          maritalStatus: patientMaritalStatus,
          accountType: accountType,
          patientId: user.uid // Placeholder for the generated patient ID
        };
      } else if (accountType === 'doctor') {
        userData = {
          fullName: doctorFullName,
          code: doctorCode,
          phoneNumber: doctorPhoneNumber,
          email: doctorEmail,
          city: doctorCity,
          address: doctorAddress,
          speciality: doctorSpeciality,
          accountType: accountType,
          doctorId: user.uid// Placeholder for the generated doctor ID
        };
      }

      // Store additional user data in Firestore
      const usersCollectionRef = collection(db, "users");
      const docRef = await addDoc(usersCollectionRef, userData);
      console.log('docRef', docRef)

      // Display successful registration alert
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => props.navigation.navigate('Login') }
      ]);
      setIsLoading(false); // Show loader
    } catch (error) {
      setIsLoading(false); // Show loader
      // Registration failed
      Alert.alert('Error', error.message);
    }
  };

  const validateInputs = () => {
    const errors = {};

    if (accountType === 'patient') {
      if (!patientFirstName.trim()) {
        errors.patientFirstName = 'Please enter your first name';
      }

      if (!patientLastName.trim()) {
        errors.patientLastName = 'Please enter your last name';
      }

      if (!patientBirthDate.trim()) {
        errors.patientBirthDate = 'Please enter your birth date';
      }

      if (!patientPhoneNumber.trim()) {
        errors.patientPhoneNumber = 'Please enter your phone number';
      }

      if (!patientEmail.trim()) {
        errors.patientEmail = 'Please enter your email';
      }

      if (!patientCinc.trim()) {
        errors.patientCinc = 'Please enter your CiNC';
      }

      if (!patientMaritalStatus.trim()) {
        errors.patientMaritalStatus = 'Please select your marital status';
      }

      if (!patientPassword.trim()) {
        errors.patientPassword = 'Please enter a password';
      }

      if (!patientConfirmPassword.trim()) {
        errors.patientConfirmPassword = 'Please confirm your password';
      }

      if (patientPassword !== patientConfirmPassword) {
        errors.patientConfirmPassword = 'Passwords do not match';
      }
    } else if (accountType === 'doctor') {
      if (!doctorFullName.trim()) {
        errors.doctorFullName = 'Please enter your full name';
      }

      if (!doctorCode.trim()) {
        errors.doctorCode = 'Please enter your code';
      }

      if (!doctorPhoneNumber.trim()) {
        errors.doctorPhoneNumber = 'Please enter your phone number';
      }

      if (!doctorEmail.trim()) {
        errors.doctorEmail = 'Please enter your email';
      }

      if (!doctorCity.trim()) {
        errors.doctorCity = 'Please enter your city';
      }

      if (!doctorAddress.trim()) {
        errors.doctorAddress = 'Please enter your address';
      }

      if (!doctorSpeciality.trim()) {
        errors.doctorSpeciality = 'Please enter your speciality';
      }

      if (!doctorPassword.trim()) {
        errors.doctorPassword = 'Please enter a password';
      }

      if (!doctorConfirmPassword.trim()) {
        errors.doctorConfirmPassword = 'Please confirm your password';
      }

      if (doctorPassword !== doctorConfirmPassword) {
        errors.doctorConfirmPassword = 'Passwords do not match';
      }
    }

    return errors;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.checkboxGroup}>
        <CheckBox
          title="Patient"
          checked={accountType === 'patient'}
          onPress={() => setAccountType('patient')}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxText}
          checkedColor="rgb(102,186,170)"
          uncheckedColor="rgb(102,186,170)"
        />
        <CheckBox
          title="Doctor"
          checked={accountType === 'doctor'}
          onPress={() => setAccountType('doctor')}
          containerStyle={styles.checkboxContainer}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checkedColor="rgb(102,186,170)"
          uncheckedColor="rgb(102,186,170)"
        />
      </View>

      {accountType === 'patient' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={patientFirstName}
            onChangeText={setPatientFirstName}
          />
          {errors.patientFirstName && <Text style={styles.errorText}>{errors.patientFirstName}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={patientLastName}
            onChangeText={setPatientLastName}
          />
          {errors.patientLastName && <Text style={styles.errorText}>{errors.patientLastName}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Birth Date"
            value={patientBirthDate}
            onChangeText={setPatientBirthDate}
          />
          {errors.patientBirthDate && <Text style={styles.errorText}>{errors.patientBirthDate}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={patientPhoneNumber}
            onChangeText={setPatientPhoneNumber}
          />
          {errors.patientPhoneNumber && <Text style={styles.errorText}>{errors.patientPhoneNumber}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={patientEmail}
            onChangeText={setPatientEmail}
          />
          {errors.patientEmail && <Text style={styles.errorText}>{errors.patientEmail}</Text>}

          <TextInput
            style={styles.input}
            placeholder="CiNC"
            value={patientCinc}
            onChangeText={setPatientCinc}
          />
          {errors.patientCinc && <Text style={styles.errorText}>{errors.patientCinc}</Text>}

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ paddingLeft: 5, color: 'rgb(102,186,170)' }}>Marital Status:</Text>
              <Picker
                selectedValue={patientMaritalStatus}
                onValueChange={(itemValue) => setPatientMaritalStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Marital Status" value="" />
                <Picker.Item label="Single" value="single" />
                <Picker.Item label="Married" value="married" />
              </Picker>
            </View>
            {errors.patientMaritalStatus && <Text style={styles.errorText}>{errors.patientMaritalStatus}</Text>}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={patientPassword}
            onChangeText={setPatientPassword}
          />
          {errors.patientPassword && <Text style={styles.errorText}>{errors.patientPassword}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={patientConfirmPassword}
            onChangeText={setPatientConfirmPassword}
          />
          {errors.patientConfirmPassword && <Text style={styles.errorText}>{errors.patientConfirmPassword}</Text>}
        </View>
      )}

      {accountType === 'doctor' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={doctorFullName}
            onChangeText={setDoctorFullName}
          />
          {errors.doctorFullName && <Text style={styles.errorText}>{errors.doctorFullName}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Code"
            value={doctorCode}
            onChangeText={setDoctorCode}
          />
          {errors.doctorCode && <Text style={styles.errorText}>{errors.doctorCode}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={doctorPhoneNumber}
            onChangeText={setDoctorPhoneNumber}
          />
          {errors.doctorPhoneNumber && <Text style={styles.errorText}>{errors.doctorPhoneNumber}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={doctorEmail}
            onChangeText={setDoctorEmail}
          />
          {errors.doctorEmail && <Text style={styles.errorText}>{errors.doctorEmail}</Text>}

          <TextInput
            style={styles.input}
            placeholder="City"
            value={doctorCity}
            onChangeText={setDoctorCity}
          />
          {errors.doctorCity && <Text style={styles.errorText}>{errors.doctorCity}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Address"
            value={doctorAddress}
            onChangeText={setDoctorAddress}
          />
          {errors.doctorAddress && <Text style={styles.errorText}>{errors.doctorAddress}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Speciality"
            value={doctorSpeciality}
            onChangeText={setDoctorSpeciality}
          />
          {errors.doctorSpeciality && <Text style={styles.errorText}>{errors.doctorSpeciality}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={doctorPassword}
            onChangeText={setDoctorPassword}
          />
          {errors.doctorPassword && <Text style={styles.errorText}>{errors.doctorPassword}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={doctorConfirmPassword}
            onChangeText={setDoctorConfirmPassword}
          />
          {errors.doctorConfirmPassword && <Text style={styles.errorText}>{errors.doctorConfirmPassword}</Text>}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show loader while isLoading is true
        ) : (
          <Text style={styles.buttonText}>SIGN UP</Text> // Show "SIGN UP" text when not loading
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'rgb(102,186,170)',
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
  },
  checkboxText: {
    fontSize: 16,
  },
  input: {
    width: 350,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(102,186,170)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: 150,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginBottom: 10,
    top: 10,
  },
  button: {
    backgroundColor: 'rgb(102,186,170)',
    borderRadius: 22,
    paddingHorizontal: 80,
    paddingVertical: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});

export default RegisterScreen;
