import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import LoadingOverlay from '../components/LoadingOverlay';


export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = 'http://192.168.8.116:5000/api/extract';

  const uploadImageForExtraction = async () => {
    if (!image) return;

    setIsLoading(true);

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
      setIsLoading(false);
      navigation.navigate('Details', { result: data });
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsLoading(false);
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
    <>
      <LoadingOverlay visible={isLoading} message="Extracting receipt details..." />

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
    </>
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 25,
    marginTop: 20,
    
  },
  buttonPrimary: {
    backgroundColor: '#4A90E2', // primary blue
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#27AE60', // calm green accent
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#27AE60',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#444444',
  },
  imagePreview: {
    width: Dimensions.get('window').width - 60,
    aspectRatio: 3 / 5,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  extractButton: {
    marginTop: 10,
    backgroundColor: '#F2994A', // muted orange
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#F2994A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  extractText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
