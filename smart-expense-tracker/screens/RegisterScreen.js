// screens/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please log in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text 
        style={styles.link} 
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#F9FAFB'  // light grayish background
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
    borderColor: '#E0E0E0', 
    padding: 14, 
    marginVertical: 10, 
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#212121',
  },
  button: {
    backgroundColor: '#4A90E2', 
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
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: '600',
  },
  link: { 
    color: '#4A90E2', 
    marginTop: 25, 
    textAlign: 'center', 
    fontSize: 15,
  },
});
