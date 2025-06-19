import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CategoryRingSummary from '../components/CategoryRingSummary';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>👤 My Profile</Text>
      <CategoryRingSummary />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#212121',
  },
});
