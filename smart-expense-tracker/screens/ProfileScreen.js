import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ReceiptHistory from '../components/ReceiptHistory';

export default function ProfileScreen() {
  const dummyData = [{}]; // single dummy item just to use FlatList

  return (
    <FlatList
      data={dummyData}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => (
        <View style={styles.container}>
          <Text style={styles.heading}>👤 My Profile</Text>
          <ReceiptHistory />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    flex: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#212121',
  },
});
