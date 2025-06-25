import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORY_COLORS = {
  Food: '#FF6384',
  Transport: '#36A2EB',
  Utilities: '#FFCE56',
  Shopping: '#4BC0C0',
  Fitness: '#9966FF',
  Health: '#FF9F40',
  Others: '#A9A9A9',
};

export default function MonthlyBarChart() {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'receipts'),
      (snap) => {
        const monthlyTotals = Array(12).fill(0);
        const categoryMap = Array(12).fill(null).map(() => ({})); // for most common category

        snap.forEach((doc) => {
          const { total, date, category = 'Others' } = doc.data();
          if (!date || !total) return;

          const parsedDate = new Date(date);
          if (isNaN(parsedDate)) return;

          const month = parsedDate.getMonth();
          const amount = parseFloat(String(total).replace(/,/g, ''));
          if (isNaN(amount)) return;

          monthlyTotals[month] += amount;

          // Tally categories
          if (!categoryMap[month][category]) {
            categoryMap[month][category] = 0;
          }
          categoryMap[month][category] += amount;
        });

        // Create chart data with color by dominant category
        const chartData = monthlyTotals.map((val, i) => {
          const topCategory = Object.entries(categoryMap[i])
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Others';
          return {
            value: parseFloat(val.toFixed(2)),
            label: MONTHS[i],
            frontColor: CATEGORY_COLORS[topCategory] || CATEGORY_COLORS['Others'],
          };
        });

        setBarData(chartData);
        setLoading(false);
      },
      (error) => {
        console.error('Error in onSnapshot:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // cleanup listener
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
    overflow: 'hidden',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
});
