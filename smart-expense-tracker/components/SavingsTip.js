// components/SavingsTip.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const tips = [
  "Track daily to find small leaks 💧",
  "Review subscriptions monthly 🔍",
  "Set a savings goal this week 🎯",
];

export default function SavingsTip() {
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <View style={styles.tipBox}>
      <Text style={styles.title}>💡 Tip of the Day</Text>
      <Text style={styles.tip}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tipBox: {
    backgroundColor: '#F1F8E9',
    padding: 14,
    borderRadius: 12,
    width: '100%',
  },
  title: {
    fontWeight: '600',
    color: '#33691E',
    marginBottom: 4,
  },
  tip: {
    color: '#558B2F',
  },
});
