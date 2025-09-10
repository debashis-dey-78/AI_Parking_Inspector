// AI Parking Inspector - Constants

export const COLORS = {
  primary: '#007AFF',      // iOS blue
  secondary: '#34C759',    // Success green
  warning: '#FF9500',      // Warning orange
  danger: '#FF3B30',       // Error red
  background: '#F2F2F7',   // Light gray
  surface: '#FFFFFF',      // White
  text: '#000000',         // Black
  textSecondary: '#8E8E93', // Gray
  border: '#C6C6C8',       // Light border
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const STORAGE_KEYS = {
  PARKING_RESULTS: 'parking_results',
  APP_SETTINGS: 'app_settings',
} as const;


export const SPLASH_DURATION = 1500; // 2 seconds