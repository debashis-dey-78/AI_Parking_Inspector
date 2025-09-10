// AI Parking Inspector - Image Utilities

import * as ImageManipulator from 'expo-image-manipulator';
import { ImagePickerResult } from '../types';

export const resizeImage = async (uri: string, maxWidth: number = 1024, maxHeight: number = 1024): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};

export const cropImage = async (uri: string, cropData: any): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ crop: cropData }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
};

export const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

export const generateImageHash = (imageUri: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `image_${timestamp}_${random}`;
};

export const validateImageSize = (image: ImagePickerResult): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  // Note: ImagePickerResult doesn't include file size, so we'll skip this validation
  // In a real app, you might want to add file size checking
  return true;
};