
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const one_on_one = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  message: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
});

export default one_on_one;
