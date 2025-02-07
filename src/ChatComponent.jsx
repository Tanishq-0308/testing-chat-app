import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://192.168.4.1:80');
    setWs(websocket);

    websocket.onmessage = (event) => {
      console.log('Received:', event.data); // Log the raw data
      const message = event.data; // Assume it's plain text for now
      setMessages((prevMessages) => [...prevMessages, { text: message, timestamp: new Date() }]);
    };
    
    

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      const message = { text: input, timestamp: new Date() };
      setMessages(prev=> [...prev, message]);
      console.log(message);
      ws.send(JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message.text}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatComponent;