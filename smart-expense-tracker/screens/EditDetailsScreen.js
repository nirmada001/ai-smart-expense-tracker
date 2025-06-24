import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function EditDetailsScreen({ route, navigation }) {
  const { receipt } = route.params;
  const [shop, setShop] = useState(receipt.shop || '');
  const [date, setDate] = useState(receipt.date || '');
  const [title, setTitle] = useState(receipt.title || '');
  const [total, setTotal] = useState(receipt.total || '');
  const [category, setCategory] = useState(receipt.category || '');

  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const ref = doc(db, 'users', user.uid, 'receipts', receipt.id);
      await updateDoc(ref, { shop, date, title, total, category });
      Alert.alert('✅ Updated', 'Receipt updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Update failed:', err);
      Alert.alert('❌ Error', 'Could not update receipt.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>✏️ Edit Receipt</Text>

          {[{ label: 'Shop', value: shop, setter: setShop },
            { label: 'Date', value: date, setter: setDate },
            { label: 'Title', value: title, setter: setTitle },
            { label: 'Total', value: total, setter: setTotal },
            { label: 'Category', value: category, setter: setCategory }]
            .map(({ label, value, setter }, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setter}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  placeholderTextColor="#999"
                />
              </View>
            ))}

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveText}>💾 Update Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    color: '#212121',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
