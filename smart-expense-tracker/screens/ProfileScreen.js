import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';

import DonutChartWithGradient from '../components/DonutChartWithGradient';
import MonthlyBarChart from '../components/MonthlyBarChart';
import ReceiptHistory from '../components/ReceiptHistory';

export default function ProfileScreen({ navigation }) {
  const [showHistory, setShowHistory] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout Confirmation', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('loginTimestamp');
          await signOut(auth);
        },
      },
    ]);
  };

  return (
    <FlatList
      data={[]}
      keyExtractor={() => 'dummy'}
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.heading}>👤 My Profile</Text>

          {/* 👇 Tapping chart triggers refresh */}
          <TouchableOpacity onPress={() => setRefreshTrigger(prev => !prev)}>
            <DonutChartWithGradient/>
          </TouchableOpacity>

          <MonthlyBarChart />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#212121',
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E53935',
    borderRadius: 8,
    shadowColor: '#E53935',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleHint: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: 30,
  },
});
