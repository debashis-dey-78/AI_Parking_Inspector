// AI Parking Inspector - Local Storage Service

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParkingResult } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

export const saveParkingResult = async (result: ParkingResult): Promise<void> => {
  try {
    const results = await getParkingResults();
    results.push(result);
    await AsyncStorage.setItem(STORAGE_KEYS.PARKING_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Error saving parking result:', error);
    throw error;
  }
};

export const getParkingResults = async (): Promise<ParkingResult[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PARKING_RESULTS);
    if (data) {
      const results = JSON.parse(data);
      // Convert timestamp strings back to Date objects
      return results.map((result: any) => ({
        ...result,
        timestamp: new Date(result.timestamp),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting parking results:', error);
    return [];
  }
};

export const clearAllResults = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PARKING_RESULTS);
  } catch (error) {
    console.error('Error clearing results:', error);
    throw error;
  }
};

export const getResultById = async (id: string): Promise<ParkingResult | null> => {
  try {
    const results = await getParkingResults();
    return results.find(result => result.id === id) || null;
  } catch (error) {
    console.error('Error getting result by ID:', error);
    return null;
  }
};