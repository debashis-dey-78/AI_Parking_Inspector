// AI Parking Inspector - Image Selection Screen Component

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/constants';
import ImagePicker from './ImagePicker';

interface ImageSelectionScreenProps {
  onImageSelected: (imageUri: string) => void;
  onBack: () => void;
}

const ImageSelectionScreen: React.FC<ImageSelectionScreenProps> = ({
  onImageSelected,
  onBack,
}) => {
  const handleImageSelected = (imageUri: string) => {
    onImageSelected(imageUri);
  };

  const handlePermissionDenied = () => {
    Alert.alert(
      'Permission Required',
      'Camera and gallery access is required to analyze parking images. Please grant permission to continue.',
      [
        {
          text: 'Go Back',
          onPress: onBack,
          style: 'default',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Select Image</Text>
          <Text style={styles.subtitle}>
            Choose how you want to capture the parking image
          </Text>
        </View>

        <View style={styles.pickerContainer}>
          <ImagePicker
            onImageSelected={handleImageSelected}
            onPermissionDenied={handlePermissionDenied}
          />
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Tips for better analysis:</Text>
          <Text style={styles.instructionText}>
            • Ensure good lighting{'\n'}
            • Capture the entire vehicle{'\n'}
            • Keep the image clear and focused{'\n'}
            • Include the parking space context
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  instructions: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  instructionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  instructionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default ImageSelectionScreen;