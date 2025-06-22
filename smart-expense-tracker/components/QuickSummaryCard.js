// components/QuickSummaryCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QuickSummaryCard({ total = 0 }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>💸 This Month's Spending</Text>
      <Text style={styles.amount}>LKR {total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    color: '#0D47A1',
    fontSize: 14,
    marginBottom: 6,
  },
  amount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1565C0',
  },
});
