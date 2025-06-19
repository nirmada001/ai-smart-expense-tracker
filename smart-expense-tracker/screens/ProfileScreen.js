import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
// import ExpenseSummary from '../components/ExpenseSummary';
import CategorySummary from '../components/CategorySummary';

export default function ProfileScreen() {
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>👤 My Profile</Text>
      
      <CategorySummary />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FAFAFA',
    flexGrow: 1,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#212121',
  },
});
