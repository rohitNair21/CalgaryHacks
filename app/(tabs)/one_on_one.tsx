import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const OneOnOne = () => {
    const [message, setMessage] = useState<string>(''); 
    const [messages, setMessages] = useState<string[]>([]); 


  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]); 
      setMessage(''); 
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  message: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
});

export default OneOnOne;
