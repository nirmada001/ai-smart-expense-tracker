// screens/LoginScreen.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert(
        '✅ Login Successful',
        'Welcome back!',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        placeholderTextColor="#757575"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
        style={styles.input} 
        placeholderTextColor="#757575"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text 
        style={styles.link} 
        onPress={() => navigation.navigate('Register')}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#F9FAFB'  // background from theme 
  },
  title: { 
    fontSize: 28, 
    marginBottom: 30, 
    textAlign: 'center', 
    fontWeight: '600', 
    color: '#212121', // dark text
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', // subtle border 
    padding: 14, 
    marginVertical: 10, 
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // card white bg 
    fontSize: 16,
    color: '#212121',
  },
  button: {
    backgroundColor: '#4A90E2', // primary blue
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#FFFFFF', // white text on button
    fontSize: 18,
    fontWeight: '600',
  },
  link: { 
    color: '#4A90E2',  // blue accent for links
    marginTop: 25, 
    textAlign: 'center', 
    fontSize: 15,
  },
});
