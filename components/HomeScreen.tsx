// AI Parking Inspector - Home Screen Component

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { VehicleType } from '../types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/constants';

interface HomeScreenProps {
  onVehicleTypeSelect: (type: VehicleType) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onVehicleTypeSelect }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Check Parking Anomaly</Text>
          <Text style={styles.subtitle}>
            Select the spot type you want to analyze for parking compliance
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.twoWheelerButton]}
            onPress={() => onVehicleTypeSelect('2-wheeler')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>🏍️</Text>
            <Text style={styles.buttonText}>2-Wheeler Spot</Text>
            <Text style={styles.buttonSubtext}>Analyze motorcycles, scooters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.fourWheelerButton]}
            onPress={() => onVehicleTypeSelect('4-wheeler')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>🚗</Text>
            <Text style={styles.buttonText}>4-Wheeler Spot</Text>
            <Text style={styles.buttonSubtext}>Analyze cars, SUVs, trucks</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by AI • Multi-Vehicle Parking Analysis
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
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
  twoWheelerButton: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  fourWheelerButton: {
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
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;