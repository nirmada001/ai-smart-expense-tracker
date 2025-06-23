import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function SavingsTip() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Fetch all receipts to get monthly category totals
        const snap = await getDocs(collection(db, 'users', user.uid, 'receipts'));

        const summary = {};
        snap.forEach(doc => {
          const { category, total } = doc.data();
          const amount = parseFloat(String(total).replace(/,/g, ''));
          if (!isNaN(amount) && category) {
            summary[category] = (summary[category] || 0) + amount;
          }
        });

        const res = await fetch('http://192.168.8.116:5000/api/tips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ summary }),
        });

        const data = await res.json();
        setTip(data.tips);
      } catch (err) {
        console.error('Failed to load tip:', err);
        setTip('💡 Track spending to discover hidden patterns!');
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, []);

  return (
    <View style={styles.tipBox}>
      <Text style={styles.title}>💡 Tip of the Day</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#33691E" />
      ) : (
        <Text style={styles.tip}>{tip}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tipBox: {
    backgroundColor: '#F1F8E9',
    padding: 14,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
    color: '#33691E',
    marginBottom: 4,
    fontSize: 16,
  },
  tip: {
    color: '#558B2F',
    fontSize: 15,
  },
});
