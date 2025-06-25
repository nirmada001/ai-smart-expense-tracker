import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import QuickSummaryCard from '../components/QuickSummaryCard';
import RecentActivityPreview from '../components/RecentActivityPreview';
import SavingsTip from '../components/SavingsTip';

export default function HomeScreen({ navigation }) {
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const receiptsRef = collection(db, 'users', user.uid, 'receipts');

    const unsubscribe = onSnapshot(receiptsRef, (snapshot) => {
      let total = 0;
      const allReceipts = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const receiptDate = new Date(data.date);
        const amount = parseFloat(String(data.total).replace(/,/g, ''));

        if (!isNaN(receiptDate) && receiptDate >= startOfMonth && !isNaN(amount)) {
          total += amount;
        }

        allReceipts.push({
          title: data.title || 'Untitled',
          amount: amount || 0,
          date: data.date,
        });
      });

      // Sort and take the top 5 recent receipts
      const recent = allReceipts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setMonthlyTotal(total);
      setRecentExpenses(recent);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Smart Expense Tracker</Text>
        <Text style={styles.subtitle}>Snap, Track & Save Smarter</Text>

        <QuickSummaryCard total={monthlyTotal} style={{ marginBottom: 20 }} />
        <RecentActivityPreview
          data={recentExpenses}
          style={{ marginBottom: 20 }}
          onPressItem={() => navigation.navigate('BottomTabNavigator', { screen: 'Receipts' })}
        />
        <SavingsTip />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Upload')}
        >
          <Text style={styles.buttonText}>📄 Upload a Bill</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingTop: 60,
    minHeight: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
