// AI Parking Inspector - Main Application

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Screen, AppState, VehicleType } from './types';
import { COLORS, SPLASH_DURATION } from './utils/constants';

// Import screens
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import ImageSelectionScreen from './components/ImageSelectionScreen';
import ImageCroppingScreen from './components/ImageCroppingScreen';
import ResultsScreen from './components/ResultsScreen';

const initialState: AppState = {
  currentScreen: 'splash',
  selectedVehicleType: null,
  selectedImage: null,
  croppedImage: null,
  analysisResult: null,
  isLoading: false,
  error: null,
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(initialState);

  // Navigation helper
  const navigateTo = (screen: Screen) => {
    setAppState(prev => ({ ...prev, currentScreen: screen }));
  };

  // State update helpers
  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  // Auto-navigate from splash screen
  useEffect(() => {
    if (appState.currentScreen === 'splash') {
      const timer = setTimeout(() => {
        navigateTo('home');
      }, SPLASH_DURATION);

      return () => clearTimeout(timer);
    }
  }, [appState.currentScreen]);

  // Render current screen
  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'splash':
        return <SplashScreen />;
      
      case 'home':
        return (
          <HomeScreen
            onVehicleTypeSelect={(type: VehicleType) => {
              updateState({ selectedVehicleType: type });
              navigateTo('image-selection');
            }}
          />
        );
      
      case 'image-selection':
        return (
          <ImageSelectionScreen
            onImageSelected={(imageUri: string) => {
              updateState({ selectedImage: imageUri });
              navigateTo('cropping');
            }}
            onBack={() => navigateTo('home')}
          />
        );
      
      case 'cropping':
        return (
          <ImageCroppingScreen
            imageUri={appState.selectedImage!}
            onCropped={(croppedUri: string) => {
              updateState({ croppedImage: croppedUri });
              navigateTo('results');
            }}
            onBack={() => navigateTo('image-selection')}
          />
        );
      
      case 'results':
        return (
          <ResultsScreen
            selectedVehicleType={appState.selectedVehicleType!}
            imageUri={appState.croppedImage!}
            onBack={() => navigateTo('home')}
            onReset={() => {
              setAppState(initialState);
              navigateTo('splash');
            }}
          />
        );
      
      default:
        return <SplashScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});