import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function DetailsScreen({ route, navigation}) {
  const { result } = route.params;

  const [shop, setShop] = useState(result.shop || '');
  const [date, setDate] = useState(result.date || '');
  const [title, setTitle] = useState(result.title || result.titleSuggestion || '');
  const [total, setTotal] = useState(result.total || '');
  const [selectedCategory, setSelectedCategory] = useState(result.categories?.[0] || '');

  const handleSave = async () => {
    const dataToSave = {
      shop,
      date,
      title,
      total,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'receipts'), dataToSave);
      Alert.alert('✅ Saved', 'Receipt details have been saved successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'), // 👈 Go back to Home
        },
      ]);
    } catch (error) {
      console.error('Error saving receipt:', error);
      Alert.alert('❌ Error', 'Failed to save receipt.');
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🧾 Receipt Details</Text>

      {/* Editable: Shop */}
      <View style={styles.card}>
        <Text style={styles.label}>Shop</Text>
        <TextInput
          style={styles.input}
          value={shop}
          onChangeText={setShop}
          placeholder="Enter shop name"
        />
      </View>

      {/* Editable: Date */}
      <View style={styles.card}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Enter date"
        />
      </View>

      {/* Editable: Title */}
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
        />
      </View>

      {/* Not Editable: Category Picker */}
      <View style={styles.card}>
        <Text style={styles.label}>Select Category</Text>
        {result.categories?.length ? (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
              style={styles.picker}
              mode="dropdown"
              dropdownIconColor="#555"
            >
              {result.categories.map((cat, index) => (
                <Picker.Item key={index} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        ) : (
          <Text style={styles.value}>N/A</Text>
        )}
      </View>

      {/* Editable: Total */}
      <View style={styles.card}>
        <Text style={styles.label}>Total</Text>
        <TextInput
          style={styles.input}
          value={total}
          onChangeText={setTotal}
          placeholder="Enter total amount"
          keyboardType="numeric"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Save Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f5f7fa',
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#222',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    fontSize: 17,
    color: '#111',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  pickerWrapper: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        height: 48,
        justifyContent: 'center',
      },
    }),
  },
  picker: {
    height: Platform.OS === 'android' ? 48 : undefined,
    width: '100%',
    color: '#333',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
