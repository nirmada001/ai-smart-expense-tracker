import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const API_URL = 'http://192.168.8.116:5000/api/extract';

  const uploadImageForExtraction = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'receipt.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      navigation.navigate('Details', { result: data });
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload failed', 'Could not process receipt.');
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📄 Smart Expense Tracker</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={takePhotoWithCamera}>
          <Text style={styles.buttonText}>📸 Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={pickImageFromGallery}>
          <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Selected Image</Text>
          <Image source={{ uri: image }} style={styles.imagePreview} />
        </View>
      )}

      {image && (
        <TouchableOpacity style={styles.extractButton} onPress={uploadImageForExtraction}>
          <Text style={styles.extractText}>🚀 Extract Info</Text>
        </TouchableOpacity>
      )}
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 25,
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  imagePreview: {
    width: Dimensions.get('window').width - 60,
    aspectRatio: 3 / 5,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  extractButton: {
    marginTop: 10,
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  extractText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
