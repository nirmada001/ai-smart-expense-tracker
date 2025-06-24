import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function ReceiptHistory({ navigation }) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'receipts', id));
      setReceipts(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate('EditDetails', { receipt: item });
  };

  if (loading) return <ActivityIndicator size="large" color="#4A90E2" />;
  if (!receipts.length) return <Text style={styles.noData}>No receipts found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📑 Saved Receipts</Text>
      <SwipeListView
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
        renderHiddenItem={({ item }) => (
          <View style={styles.hiddenContainer}>
            <TouchableOpacity
              style={[styles.hiddenButton, styles.editBtn]}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.hiddenText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.hiddenButton, styles.deleteBtn]}
              onPress={() => confirmDelete(item.id)}
            >
              <Text style={styles.hiddenText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
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
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
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
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  hiddenButton: {
    width: 75,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  deleteBtn: {
    backgroundColor: '#F44336',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  hiddenText: {
    color: '#fff',
    fontWeight: '600',
  },
});
