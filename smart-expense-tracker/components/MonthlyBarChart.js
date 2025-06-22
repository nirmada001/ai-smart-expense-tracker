import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function MonthlyBarChart() {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snap = await getDocs(collection(db, 'users', user.uid, 'receipts'));
        const monthlyTotals = Array(12).fill(0);

        snap.forEach((doc) => {
          const { total, date } = doc.data();
          if (!date || !total) return;

          const parsedDate = new Date(date);
          if (isNaN(parsedDate)) return;

          const month = parsedDate.getMonth();
          const amount = parseFloat(String(total).replace(/,/g, ''));
          if (!isNaN(amount)) {
            monthlyTotals[month] += amount;
          }
        });

        const chartData = monthlyTotals.map((val, i) => ({
          value: parseFloat(val.toFixed(2)),
          label: MONTHS[i],
          frontColor: '#4A90E2',
        }));

        setBarData(chartData);
      } catch (err) {
        console.error('Bar chart data load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator size="small" color="#4A90E2" />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📅 Monthly Spending</Text>
      <BarChart
        data={barData}
        barWidth={22}
        initialSpacing={10}
        spacing={12}
        hideRules
        yAxisThickness={0}
        xAxisLabelTextStyle={{ color: '#888', fontSize: 12 }}
        noOfSections={4}
        isAnimated
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    elevation: 2,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
});
