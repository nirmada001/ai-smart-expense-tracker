import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

export default function LoadingOverlay({ visible, message = 'Processing...' }) {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 6,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
});
