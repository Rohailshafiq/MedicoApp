import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { app } from '../config/firebase';
import { getFirestore, collection, doc, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import messaging from '@react-native-firebase/messaging';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const { appointmentId } = route.params;

  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'appointments', appointmentId, 'messages'), // Update the collection path
        orderBy('timestamp', 'desc'), // Order messages in descending order
        limit(100)
      ),

      (snapshot) => {
        const messageList = snapshot.docs.map((doc) => doc.data());
        setMessages(messageList);
      },
      (error) => {
        console.log('Error fetching messages:', error);
      }
    );
    messaging().getToken().then((token) => {
      console.log('token', token)
      // Save the FCM device token to the Firestore user documen
    });
    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [db, appointmentId]);


  const handleSendMessage = async () => {
    if (messageText.trim() === '') {
      return;
    }

    const message = {
      senderId: currentUser.uid,
      text: messageText.trim(),
      timestamp: new Date(),
    };

    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const messagesRef = collection(appointmentRef, 'messages');

      if (messages.length === 0) {
        const defaultMessage = {
          senderId: 'doctor', // Set a unique identifier for the doctor
          text: `Hi, thank you for reaching out. Our agent will contact you shortly.\n\nOur office timing are 10AM to 5PM\n(Monday to Sunday)`,
          timestamp: new Date(),
        };
        await addDoc(messagesRef, defaultMessage);
      }

      await addDoc(messagesRef, message);
      setMessageText('');
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };


  const renderItem = ({ item }) => {
    const isPatientMessage = item.senderId === currentUser.uid;
    const messageDate = item.timestamp.toDate().toLocaleDateString();
    const messageTime = item.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View
        style={[
          styles.messageContainer,
          isPatientMessage ? styles.patientMessageContainer : styles.doctorMessageContainer,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isPatientMessage ? styles.patientMessageText : styles.doctorMessageText,
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.messageTime}>{messageDate} {messageTime}</Text>
      </View>
    );
  };


  return (
    // <KeyboardAvoidingView behavior="padding" style={styles.container}>
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messageList}
          inverted
          keyboardDismissMode="interactive"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgb(103,186,170)',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  messageContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    maxWidth: '75%',
  },
  patientMessageContainer: {
    backgroundColor: '#eee',
    alignSelf: 'flex-end',
  },
  doctorMessageContainer: {
    backgroundColor: 'rgb(103, 186, 170)',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  patientMessageText: {
    color: '#000',
  },
  doctorMessageText: {
    color: '#fff',
  },
});

export default ChatScreen;
