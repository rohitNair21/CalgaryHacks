import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';

function dismissKeyboard() {
  Keyboard.dismiss();
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isLoaded: signInIsReady, signIn: clerkSignIn, setActive: setSignInActive } = useSignIn();

  const handleLogin = async () => {
    try {
      if (signInIsReady) {
        const completeSignIn = await clerkSignIn.create({ identifier: email, password })
        if (completeSignIn.status === "complete") {
          await setSignInActive({ session: completeSignIn.createdSessionId })
          dismissKeyboard();
          router.push("/community")
        }
      } else {
        Alert.alert("Login Failed", "An error occured, please try again");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.forgotPassword}>Forgot password?</Text>

        {/* SIGN IN FUNCTIONALITY NEEDED FROM CLERK */}
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>

        {/* SIGN UP FUNCTIONALITY NOT NECESSARY */}
        <Text style={styles.signupText}>
          Don’t have an account?{' '}
          <Text style={styles.signupLink}>Sign up</Text>
        </Text>

        {/* Continue as a guest */}
        <TouchableOpacity style={styles.guestButton} onPress={() => router.push('/community')}>
          <Text style={styles.guestText}>Continue as a guest →</Text>
        </TouchableOpacity>
      </View>
      <Image source={require('@/assets/images/hug.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fdeff2',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Lexend_700Bold',
    color: '#000',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#666',
  },
  signInButton: {
    backgroundColor: '#800040',
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
  },
  signupLink: {
    color: '#800040',
  },
  guestButton: {
    marginTop: 15,
  },
  guestText: {
    color: '#666',
    fontSize: 14,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
  },
});

export default Login;
