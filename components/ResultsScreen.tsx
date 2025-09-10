// AI Parking Inspector - Results Screen Component

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert, Image, Share } from 'react-native';
import { VehicleType, ParkingResult, MultiVehicleDetectionResult } from '../types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/constants';
import { analyzeImageWithGemini, validateVehicleTypeMatch, testGeminiConnection, exportToCSV, generateCSVFilename } from '../services/api';
import { saveParkingResult } from '../services/storage';
import { generateImageHash } from '../services/imageUtils';

interface ResultsScreenProps {
  selectedVehicleType: VehicleType;
  imageUri: string;
  onBack: () => void;
  onReset: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  selectedVehicleType,
  imageUri,
  onBack,
  onReset,
}) => {
  const [result, setResult] = useState<ParkingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test API connection first
    testGeminiConnection().then((isConnected) => {
      console.log('Gemini API connection test result:', isConnected);
      if (!isConnected) {
        console.error('Gemini API is not accessible. Will use fallback data.');
      }
    });
    
    analyzeImage();
  }, []);

  const analyzeImage = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const imageName = `parking_${Date.now()}.jpg`;
      
      // Analyze image with Gemini API for multi-vehicle detection
      const multiVehicleResult = await analyzeImageWithGemini(imageUri, selectedVehicleType, imageName);
      
      // Create parking result
      const parkingResult: ParkingResult = {
        id: generateImageHash(imageUri),
        filename: imageName,
        timestamp: new Date(),
        multi_vehicle_result: multiVehicleResult,
        user_selected_type: selectedVehicleType,
        image_uri: imageUri,
      };

      // Save to local storage
      await saveParkingResult(parkingResult);
      
      setResult(parkingResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!result) return;
    
    try {
      const csvContent = exportToCSV(result.multi_vehicle_result, result.user_selected_type);
      const filename = generateCSVFilename();
      
      // For React Native, we'll use Share API to export CSV
      await Share.share({
        message: csvContent,
        title: filename,
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Export Failed', 'Could not export CSV file. Please try again.');
    }
  };

  const handleNewAnalysis = () => {
    onReset();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Analyzing Image...</Text>
          <Text style={styles.loadingSubtext}>This may take a few moments</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Analysis Failed</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={analyzeImage}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!result) return null;

  const { multi_vehicle_result } = result;
  const { vehicles, image_summary } = multi_vehicle_result;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Analysis Results</Text>
        </View>

        {/* Display the analyzed image */}
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Analyzed Image</Text>
          <Image source={{ uri: imageUri }} style={styles.analyzedImage} resizeMode="cover" />
        </View>

        {/* Per-Image Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Image Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{image_summary.total_vehicles}</Text>
              <Text style={styles.summaryLabel}>Total Vehicles</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{image_summary.two_wheelers}</Text>
              <Text style={styles.summaryLabel}>Two-Wheelers</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{image_summary.four_wheelers}</Text>
              <Text style={styles.summaryLabel}>Four-Wheelers</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: COLORS.secondary }]}>{image_summary.correctly_parked}</Text>
              <Text style={styles.summaryLabel}>Correctly Parked</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: COLORS.warning }]}>{image_summary.wrongly_parked}</Text>
              <Text style={styles.summaryLabel}>Wrongly Parked</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Cards */}
        <View style={styles.vehiclesContainer}>
          <Text style={styles.sectionTitle}>Detected Vehicles</Text>
          {vehicles.map((vehicle, index) => (
            <View key={index} style={styles.vehicleCard}>
              <View style={styles.vehicleHeader}>
                <Text style={styles.vehicleTitle}>Vehicle #{vehicle.vehicle_index}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: vehicle.is_correct ? COLORS.secondary : COLORS.warning }
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {vehicle.is_correct ? '✅ Match' : '⚠️ Mismatch'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.vehicleDetails}>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Type:</Text>
                  <Text style={styles.vehicleValue}>{vehicle.vehicle_type}</Text>
                </View>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Parking:</Text>
                  <Text style={[
                    styles.vehicleValue,
                    { color: vehicle.parking_status === 'Properly Parked' ? COLORS.secondary : COLORS.warning }
                  ]}>
                    {vehicle.parking_status}
                  </Text>
                </View>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Orientation:</Text>
                  <Text style={styles.vehicleValue}>{vehicle.orientation}</Text>
                </View>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Plate:</Text>
                  <Text style={styles.vehicleValue}>{vehicle.plate_number}</Text>
                </View>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Brand:</Text>
                  <Text style={styles.vehicleValue}>{vehicle.brand}</Text>
                </View>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Model:</Text>
                  <Text style={styles.vehicleValue}>{vehicle.model}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleExportCSV}>
            <Text style={styles.secondaryButtonText}>📊 Export CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNewAnalysis}>
            <Text style={styles.primaryButtonText}>🔄 New Analysis</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  errorTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  header: {
    paddingTop: SPACING.lg,
    marginBottom: SPACING.lg,
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
  },
  imageContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyzedImage: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  summaryNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  vehiclesContainer: {
    marginBottom: SPACING.lg,
  },
  vehicleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  vehicleTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  vehicleDetails: {
    gap: SPACING.sm,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    flex: 1,
  },
  vehicleValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.surface,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    minWidth: 200,
  },
  retryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.surface,
  },
});

export default ResultsScreen;