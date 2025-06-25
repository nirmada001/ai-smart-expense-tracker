import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

export default function ReceiptHistory({ navigation, refreshTrigger, onDelete }) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fetchReceipts = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'receipts'));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((item) => {
          const date = new Date(item.date);
          return (
            date.getMonth() === selectedMonth &&
            date.getFullYear() === selectedYear
          );
        });

      setReceipts(data.sort((a, b) => new Date(b.date) - new Date(a.date))); // latest first
    } catch (err) {
      console.error('Error fetching receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [refreshTrigger, selectedMonth, selectedYear]);

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'receipts', id));
      setReceipts(prev => prev.filter(item => item.id !== id));
      onDelete?.(); // Notify parent to refresh
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert('Delete Receipt', 'Are you sure you want to delete this receipt?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
    ]);
  };

  const handleEdit = (item) => {
    navigation?.navigate('EditDetails', { receipt: item });
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📑 Saved Receipts</Text>

      {/* Filter Dropdown */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          mode="dropdown"
        >
          {MONTH_NAMES.map((name, index) => (
            <Picker.Item key={index} label={name} value={index} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          mode="dropdown"
        >
          {years.map((year, index) => (
            <Picker.Item key={index} label={year.toString()} value={year} />
          ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      ) : receipts.length === 0 ? (
        <Text style={styles.noData}>No receipts for this month.</Text>
      ) : (
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
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  picker: {
    width: Platform.OS === 'ios' ? 140 : 120,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
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
  noData: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
