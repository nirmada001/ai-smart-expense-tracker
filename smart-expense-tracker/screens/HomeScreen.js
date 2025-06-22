import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import QuickSummaryCard from '../components/QuickSummaryCard';
import RecentActivityPreview from '../components/RecentActivityPreview';
import SavingsTip from '../components/SavingsTip';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Expense Tracker</Text>
        <Text style={styles.subtitle}>Snap, Track & Save Smarter</Text>
      </View>

      {/* Content Cards */}
      <View style={styles.content}>
        <QuickSummaryCard total={5300} />
        <RecentActivityPreview
          data={[
            { title: 'Groceries', amount: 1500 },
            { title: 'Transport', amount: 300 },
          ]}
        />
        <SavingsTip />
      </View>

      {/* Call to Action */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.buttonText}>📄 Upload a Bill</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7FA',
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    alignItems: 'center',
    
  },
  header: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0D47A1',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#546E7A',
    marginTop: 6,
    textAlign: 'center',
  },
  content: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
