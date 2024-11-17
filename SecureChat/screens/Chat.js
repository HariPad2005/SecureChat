import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';

export default function Chat({ navigation }) {
  const [messages, setMessages] = useState([]);

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "SecureChat-Forum", // Updated header name
      headerRight: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={onSignOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, 'chats'), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  // Custom Bubble to add enhanced styling
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0078FF', // Blue bubble for sent messages
            borderRadius: 15,
            padding: 5,
          },
          left: {
            backgroundColor: 'green', // green bubble for received messages
            borderRadius: 15,
            padding: 5,
          },
        }}
        textStyle={{
          right: {
            color: '#FFFFFF',
            fontSize: 16,
          },
          left: {
            color: '#FFFFFF',
            fontSize: 16,
          },
        }}
      />
    );
  };

  // Custom Avatar Replacement: Shows Identity Before '@'
  const renderCustomView = (props) => {
    const email = props.currentMessage.user._id;
    const identity = email.split('@')[0]; // Extract characters before '@'
    return (
      <View style={styles.emailContainer}>
        <Text style={styles.identityText}>{identity}</Text>
      </View>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      renderBubble={renderBubble}
      renderCustomView={renderCustomView}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.email,
      }}
    />
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FF0000', // Red background for logout button
  },
  logoutText: {
    fontSize: 16,
    color: '#FFFFFF', // White text for logout button
  },
  emailContainer: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  identityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'yellow', // yellow color for sender identity
  },
});
