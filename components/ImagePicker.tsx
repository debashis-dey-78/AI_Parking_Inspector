// AI Parking Inspector - Image Picker Component

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePickerLib from 'expo-image-picker';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/constants';

interface ImagePickerProps {
  onImageSelected: (imageUri: string) => void;
  onPermissionDenied: () => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  onImageSelected,
  onPermissionDenied,
}) => {
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePickerLib.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePickerLib.requestMediaLibraryPermissionsAsync();
    
    return {
      camera: cameraStatus === 'granted',
      media: mediaStatus === 'granted',
    };
  };

  const pickImageFromGallery = async () => {
    const permissions = await requestPermissions();
    
    if (!permissions.media) {
      onPermissionDenied();
      return;
    }

    try {
      const result = await ImagePickerLib.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to select image from gallery');
    }
  };

  const takePhotoWithCamera = async () => {
    const permissions = await requestPermissions();
    
    if (!permissions.camera) {
      onPermissionDenied();
      return;
    }

    try {
      const result = await ImagePickerLib.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.galleryButton]}
        onPress={pickImageFromGallery}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>📷</Text>
        <Text style={styles.buttonText}>Choose Image from Gallery</Text>
        <Text style={styles.buttonSubtext}>Select from your photos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cameraButton]}
        onPress={takePhotoWithCamera}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>📸</Text>
        <Text style={styles.buttonText}>Use Camera</Text>
        <Text style={styles.buttonSubtext}>Take a new photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryButton: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  cameraButton: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  buttonSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});

export default ImagePicker;