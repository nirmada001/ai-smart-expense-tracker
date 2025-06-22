// components/RecentActivityPreview.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecentActivityPreview({ data = [] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🕒 Recent Expenses</Text>
      {data.length === 0 ? (
        <Text style={styles.empty}>No recent activity</Text>
      ) : (
        data.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.amount}>LKR {item.amount}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0',
    padding: 14,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  heading: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#BF360C',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  title: {
    color: '#6D4C41',
  },
  amount: {
    fontWeight: '600',
    color: '#D84315',
  },
  empty: {
    fontStyle: 'italic',
    color: '#A1887F',
  },
});
