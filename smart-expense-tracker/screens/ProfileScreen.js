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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import DonutChartWithGradient from '../components/DonutChartWithGradient';
import MonthlyBarChart from '../components/MonthlyBarChart';

export default function ProfileScreen({ navigation }) {
  const [showHistory, setShowHistory] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReceipts = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'receipts'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReceipts(data.reverse());
    } catch (err) {
      console.error('Error fetching receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchReceipts();
    }
  }, [showHistory]);

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('loginTimestamp');
            await signOut(auth);
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.heading}>👤 My Profile</Text>
      <DonutChartWithGradient />
      <MonthlyBarChart />
      <TouchableOpacity onPress={() => setShowHistory(prev => !prev)}>
        <Text style={styles.toggleHint}>
          {showHistory ? '🔽 Hide Receipts' : '📑 View Receipts'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderReceiptItem = ({ item }) => (
    <View style={styles.receiptCard}>
      <Text style={styles.text}>🏪 Shop: {item.shop}</Text>
      <Text style={styles.text}>🗓️ Date: {item.date}</Text>
      <Text style={styles.text}>📝 Title: {item.title}</Text>
      <Text style={styles.text}>📂 Category: {item.category}</Text>
      <Text style={styles.text}>💵 Total: Rs. {item.total}</Text>
    </View>
  );

  return (
    <FlatList
      data={showHistory ? receipts : []}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      renderItem={renderReceiptItem}
      ListFooterComponent={
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      }
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        showHistory && !loading ? (
          <Text style={styles.noData}>No receipts found.</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 24,
    backgroundColor: '#FAFAFA',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#212121',
  },
  toggleHint: {
    fontSize: 16,
    color: '#4A90E2',
    marginTop: 30,
    textAlign: 'center',
  },
  receiptCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  text: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E53935',
    borderRadius: 8,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
