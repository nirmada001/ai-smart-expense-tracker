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
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#FFA726',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heading: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
    color: '#E65100',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  title: {
    color: '#6D4C41',
    fontSize: 15,
    flex: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  amount: {
    fontWeight: '600',
    color: '#D84315',
    fontSize: 15,
    flexShrink: 0,
  },
  empty: {
    fontStyle: 'italic',
    color: '#A1887F',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
});


