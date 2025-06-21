import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import ReceiptHistory from './ReceiptHistory';

const screenWidth = Dimensions.get('window').width;

const COLORS = [
  '#4CAF50', '#FF9800', '#2196F3', '#9C27B0',
  '#F44336', '#FFC107', '#00BCD4', '#795548',
];

export default function CategoryPieChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snapshot = await getDocs(collection(db, 'users', user.uid, 'receipts'));
        const totals = {};
        let total = 0;

        snapshot.forEach(doc => {
          const { category, total: amount } = doc.data();

          // ✅ Sanitize: remove commas and parse
          const cleanedAmount = typeof amount === 'string'
            ? amount.replace(/,/g, '')
            : amount;

          const value = parseFloat(cleanedAmount);

          if (!isNaN(value) && category) {
            totals[category] = (totals[category] || 0) + value;
            total += value;
          }
        });

        const result = Object.keys(totals).map((cat, idx) => ({
          name: cat,
          amount: Number(totals[cat]),
          color: COLORS[idx % COLORS.length],
          legendFontColor: '#000',
          legendFontSize: 13,
        }));

        setData(result);
        setTotalSpent(total);
      } catch (e) {
        console.error('Error loading pie chart data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) return <ActivityIndicator size="large" color="#4A90E2" />;
  if (!data.length) return <Text style={styles.noData}>No data to show</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Spending by Category</Text>

      <PieChart
        data={data}
        width={screenWidth * 0.95}
        height={220}
        chartConfig={{
          color: () => `#000`,
          decimalPlaces: 0, // Prevent values like 4.5k
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[5, 0]}
        absolute
      />

      <Text style={styles.totalText}>Total Spent: LKR {totalSpent.toFixed(2)}</Text>

      <TouchableOpacity onPress={() => setShowHistory(prev => !prev)}>
        <Text style={styles.toggleHint}>
          {showHistory ? '🔽 Hide Receipt History' : '📑 Tap to View Receipts'}
        </Text>
      </TouchableOpacity>

      {showHistory && (
        <View style={styles.historySection}>
          <ReceiptHistory />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noData: {
    color: '#888',
    marginTop: 30,
  },
  toggleHint: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
    color: '#666',
  },
  totalText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  historySection: {
    marginTop: 20,
    width: '100%',
  },
});
