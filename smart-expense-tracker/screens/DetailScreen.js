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

export default function DetailsScreen({ route, navigation }) {
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
          onPress: () => navigation.navigate('Home'),
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

      {/* Shop */}
      <View style={styles.card}>
        <Text style={styles.label}>Shop</Text>
        <TextInput
          style={styles.input}
          value={shop}
          onChangeText={setShop}
          placeholder="Enter shop name"
          placeholderTextColor="#999"
        />
      </View>

      {/* Date */}
      <View style={styles.card}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Enter date"
          placeholderTextColor="#999"
        />
      </View>

      {/* Title */}
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor="#999"
        />
      </View>

      {/* Category */}
      <View style={styles.card}>
        <Text style={styles.label}>Select Category</Text>
        {result.categories?.length ? (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
              style={styles.picker}
              mode="dropdown"
              dropdownIconColor="#4A90E2"
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

      {/* Total */}
      <View style={styles.card}>
        <Text style={styles.label}>Total</Text>
        <TextInput
          style={styles.input}
          value={total}
          onChangeText={setTotal}
          placeholder="Enter total amount"
          placeholderTextColor="#999"
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
  pickerWrapper: {
    backgroundColor: '#F0F4F8',
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
    color: '#212121',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4A90E2',
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
