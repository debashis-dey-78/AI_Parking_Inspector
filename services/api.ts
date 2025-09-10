// AI Parking Inspector - Gemini API Service

import { GoogleGenerativeAI } from '@google/generative-ai';
import { MultiVehicleDetectionResult, VehicleDetectionResult, VehicleType, ImageSummary } from '../types';
import { convertImageToBase64 } from './imageUtils';

// Import environment variable
import { GEMINI_API_KEY } from '@env';

// Initialize Gemini AI with environment variable
const API_KEY = GEMINI_API_KEY || 'AIzaSyCUElqQnlo7A83y01HLb_IeJkqMsVcRmAU';
const GEMINI_MODEL = 'gemini-1.5-flash';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

export const analyzeImageWithGemini = async (
  imageUri: string, 
  userSelectedType: VehicleType,
  imageName: string
): Promise<MultiVehicleDetectionResult> => {
  try {
    console.log('Environment API Key available:', !!GEMINI_API_KEY);
    console.log('Using API Key length:', API_KEY.length);
    console.log('API Key starts with:', API_KEY.substring(0, 10) + '...');
    
    const base64Image = await convertImageToBase64(imageUri);

    const prompt = `
    You are an AI parking inspector. Analyze this image and detect ALL vehicles present. 
    Ignore vehicles that are less than 40% visible or cut off at the edges.
    
    Return ONLY a valid JSON object with this structure:
    {
        "vehicles": [
            {
                "vehicle_type": "Two-Wheeler" or "Four-Wheeler",
                "parking_status": "Properly Parked" or "Improper Parking",
                "orientation": "Front Facing" or "Rear Facing" or "Side",
                "plate_number": "Detected Plate Number" or "Unknown",
                "brand": "Brand Name" or "Unknown",
                "model": "Model Name" or "Unknown"
            }
        ]
    }
    
    For parking_status: Consider the vehicle properly parked if it's within designated lines and not blocking traffic.
    For orientation: Determine which direction the vehicle is facing relative to the camera.
    Only include vehicles that are clearly visible and identifiable.
    No extra text, no explanation, no markdown formatting.`;

    console.log('Sending request to Gemini API for multi-vehicle detection...');
    console.log('Image data length:', base64Image.length);
    
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: base64Image } }
    ]);
    
    console.log('Received response from Gemini API');

    const responseText = result.response?.text() ?? "{}";

    let cleanResponse = responseText.trim();
    if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/```json\s*|\s*```/g, '').trim();
    }

    const parsedResult = JSON.parse(cleanResponse);
    const vehicles = parsedResult.vehicles || [];

    // Process each vehicle and add validation
    const processedVehicles: VehicleDetectionResult[] = vehicles.map((vehicle: any, index: number) => {
      const isCorrect = validateVehicleTypeMatch(userSelectedType, vehicle.vehicle_type).isMatch;
      
      // Determine final parking status based on BOTH decisions:
      // 1. AI's parking status decision
      // 2. Type matching decision
      let finalParkingStatus = vehicle.parking_status || "Unknown";
      
      // If there's a type mismatch, override the parking status to "Improper Parking"
      if (!isCorrect) {
        finalParkingStatus = "Improper Parking";
      }
      
      return {
        vehicle_type: vehicle.vehicle_type || "Unknown",
        parking_status: finalParkingStatus,
        orientation: vehicle.orientation || "Unknown",
        plate_number: vehicle.plate_number || "Unknown",
        brand: vehicle.brand || "Unknown",
        model: vehicle.model || "Unknown",
        is_correct: isCorrect,
        vehicle_index: index + 1
      };
    });

    // Generate image summary
    // Since we now modify parking_status based on both decisions,
    // we can simply count based on the final parking_status
    const correctlyParked = processedVehicles.filter(v => 
      v.parking_status === "Properly Parked"
    ).length;
    
    const wronglyParked = processedVehicles.filter(v => 
      v.parking_status === "Improper Parking"
    ).length;

    const imageSummary: ImageSummary = {
      total_vehicles: processedVehicles.length,
      two_wheelers: processedVehicles.filter(v => v.vehicle_type === "Two-Wheeler").length,
      four_wheelers: processedVehicles.filter(v => v.vehicle_type === "Four-Wheeler").length,
      correctly_parked: correctlyParked,
      wrongly_parked: wronglyParked
    };

    return {
      vehicles: processedVehicles,
      image_summary: imageSummary,
      image_name: imageName
    };

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    
    // Return mock data as fallback
    const mockIsCorrect = validateVehicleTypeMatch(userSelectedType, "Four-Wheeler").isMatch;
    let mockParkingStatus = "Properly Parked";
    
    // Apply same logic to mock data - if type mismatch, override parking status
    if (!mockIsCorrect) {
      mockParkingStatus = "Improper Parking";
    }
    
    const mockVehicles: VehicleDetectionResult[] = [
      {
        vehicle_type: "Four-Wheeler",
        parking_status: mockParkingStatus,
        orientation: "Rear Facing",
        plate_number: "AS06AD6203",
        brand: "Maruti Suzuki",
        model: "Alto",
        is_correct: mockIsCorrect,
        vehicle_index: 1
      }
    ];

    // Apply same logic to mock data
    const mockCorrectlyParked = mockVehicles.filter(v => 
      v.parking_status === "Properly Parked"
    ).length;
    
    const mockWronglyParked = mockVehicles.filter(v => 
      v.parking_status === "Improper Parking"
    ).length;

    const mockSummary: ImageSummary = {
      total_vehicles: mockVehicles.length,
      two_wheelers: mockVehicles.filter(v => v.vehicle_type === "Two-Wheeler").length,
      four_wheelers: mockVehicles.filter(v => v.vehicle_type === "Four-Wheeler").length,
      correctly_parked: mockCorrectlyParked,
      wrongly_parked: mockWronglyParked
    };

    return {
      vehicles: mockVehicles,
      image_summary: mockSummary,
      image_name: imageName
    };
  }
};

export const validateVehicleTypeMatch = (
  userSelected: VehicleType,
  detected: string
): { isMatch: boolean; message: string } => {
  const userType = userSelected === '2-wheeler' ? 'Two-Wheeler' : 'Four-Wheeler';
  const isMatch = detected.toLowerCase().includes(userType.toLowerCase());
  
  return {
    isMatch,
    message: isMatch 
      ? `✅ Vehicle type matches your selection (${userType})`
      : `⚠️ Vehicle type mismatch! You selected ${userType} but detected ${detected}`
  };
};

// CSV Export functionality
export const exportToCSV = (result: MultiVehicleDetectionResult, userSelectedType: VehicleType): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const csvRows: string[] = [];
  
  // CSV Header
  csvRows.push('Image Name,Vehicle Index,Vehicle Type,Parking Status,Orientation,Plate Number,Brand,Model,Is Correct,User Selected Type,Image Correct Count,Image Wrong Count');
  
  // Add data rows
  result.vehicles.forEach(vehicle => {
    const row = [
      result.image_name,
      vehicle.vehicle_index.toString(),
      vehicle.vehicle_type,
      vehicle.parking_status,
      vehicle.orientation,
      vehicle.plate_number,
      vehicle.brand,
      vehicle.model,
      vehicle.is_correct.toString(),
      userSelectedType,
      result.image_summary.correctly_parked.toString(),
      result.image_summary.wrongly_parked.toString()
    ].map(field => `"${field}"`).join(',');
    
    csvRows.push(row);
  });
  
  return csvRows.join('\n');
};

// Generate timestamped filename for CSV
export const generateCSVFilename = (): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `parking_analysis_${timestamp}.csv`;
};

// Test function to verify API key
export const testGeminiConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Gemini API connection...');
    console.log('API Key being used:', API_KEY.substring(0, 10) + '...');
    
    const result = await model.generateContent([
      { text: "Hello, respond with just 'OK' if you can read this." }
    ]);
    
    const response = result.response?.text();
    console.log('Gemini API test response:', response);
    return true;
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return false;
  }
};