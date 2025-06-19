import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function ExpenseSummary({ totalSpent = 3500, budget = 5000 }) {
  const fill = Math.min((totalSpent / budget) * 100, 100); // Clamp to 100%

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Expense Summary</Text>

      <AnimatedCircularProgress
        size={180}
        width={15}
        fill={fill}
        tintColor={fill < 80 ? '#4CAF50' : '#FF5722'}
        backgroundColor="#E0E0E0"
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View style={styles.center}>
            <Text style={styles.percentage}>{Math.round(fill)}%</Text>
            <Text style={styles.label}>of your budget used</Text>
          </View>
        )}
      </AnimatedCircularProgress>

      <View style={styles.stats}>
        <Text style={styles.statText}>💰 Budget: Rs. {budget}</Text>
        <Text style={styles.statText}>🧾 Spent: Rs. {totalSpent}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  stats: {
    marginTop: 20,
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    color: '#333',
  },
});
