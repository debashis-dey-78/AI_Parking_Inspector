// AI Parking Inspector - TypeScript Interfaces

export type VehicleType = '2-wheeler' | '4-wheeler';

export type Screen = 'splash' | 'home' | 'image-selection' | 'cropping' | 'results';

export interface VehicleDetectionResult {
  vehicle_type: string;
  parking_status: string;
  orientation: string;
  plate_number: string;
  brand: string;
  model: string;
  is_correct: boolean;
  vehicle_index: number;
}

export interface ImageSummary {
  total_vehicles: number;
  two_wheelers: number;
  four_wheelers: number;
  correctly_parked: number;
  wrongly_parked: number;
}

export interface MultiVehicleDetectionResult {
  vehicles: VehicleDetectionResult[];
  image_summary: ImageSummary;
  image_name: string;
}

export interface ParkingResult {
  id: string;
  filename: string;
  timestamp: Date;
  multi_vehicle_result: MultiVehicleDetectionResult;
  user_selected_type: VehicleType;
  image_uri: string;
}

export interface AppState {
  currentScreen: Screen;
  selectedVehicleType: VehicleType | null;
  selectedImage: string | null;
  croppedImage: string | null;
  analysisResult: ParkingResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type: string;
}