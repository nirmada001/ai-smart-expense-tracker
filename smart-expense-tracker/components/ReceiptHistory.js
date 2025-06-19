// components/ReceiptHistory.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function ReceiptHistory() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snapshot = await getDocs(collection(db, 'users', user.uid, 'receipts'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReceipts(data.reverse()); // show latest first
      } catch (err) {
        console.error('Error fetching receipts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#4A90E2" />;
  if (!receipts.length) return <Text style={styles.noData}>No receipts found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📑 Saved Receipts</Text>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>🏪 Shop: {item.shop}</Text>
            <Text style={styles.text}>🗓️ Date: {item.date}</Text>
            <Text style={styles.text}>📝 Title: {item.title}</Text>
            <Text style={styles.text}>📂 Category: {item.category}</Text>
            <Text style={styles.text}>💵 Total: Rs. {item.total}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  noData: {
    marginTop: 20,
    color: '#888',
    textAlign: 'center',
  },
});
