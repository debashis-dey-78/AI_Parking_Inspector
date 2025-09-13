# AI Parking Inspector 🚗📱

A smart mobile application that uses AI to analyze parking situations and detect vehicles in parking areas. Built with React Native and Expo, powered by Google's Gemini AI for intelligent vehicle detection and parking analysis.

## 🌟 Features

- **Smart Vehicle Detection**: Automatically detects and analyzes vehicles in parking areas
- **Multi-Vehicle Support**: Handles both two-wheelers and four-wheelers
- **Parking Status Analysis**: Determines if vehicles are properly parked or not
- **Vehicle Details**: Extracts brand, model, license plate, and orientation information
- **Image Processing**: Built-in image cropping and manipulation tools
- **Real-time Analysis**: Fast AI-powered analysis using Google Gemini API
- **Cross-Platform**: Works on Android, iOS, and Web

## 🚀 Screenshots

*Screenshots will be added after the app is built*

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **AI Engine**: Google Gemini 1.5 Flash
- **Image Processing**: Expo Image Manipulator
- **Camera**: Expo Camera
- **Storage**: AsyncStorage
- **Language**: TypeScript
- **Build System**: EAS Build

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) (for building)
- [Git](https://git-scm.com/) (for version control)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/debashis-dey-78/AI_Parking_Inspector.git
cd AI_Parking_Inspector
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: Get your free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Start the Development Server

```bash
npm start
# or
yarn start
```

This will start the Expo development server. You can then:
- Press `a` to run on Android device/emulator
- Press `i` to run on iOS simulator
- Press `w` to run in web browser
- Scan the QR code with Expo Go app on your mobile device

## 🏗️ Building the App

### Development Build

```bash
eas build --platform android --profile development
```

### Preview Build (APK)

```bash
eas build --platform android --profile preview
```

### Production Build

```bash
eas build --platform android --profile production
```

## 📱 APK Download

**Latest APK Build**: [Download APK v1.0.2](https://expo.dev/accounts/ddey78/projects/ai-parking-inspector/builds/eab8fe67-2e5e-42fd-9fdb-570388ae0ae3)

*Ready for download - Latest build with updated parking icon and code improvements*

## 🎯 How to Use

1. **Launch the App**: Open the AI Parking Inspector app
2. **Select Vehicle Type**: Choose between Two-Wheeler or Four-Wheeler
3. **Capture Image**: Take a photo or select from gallery
4. **Crop Image**: Adjust the image to focus on the parking area
5. **Analyze**: Let the AI analyze the image and detect vehicles
6. **View Results**: See detailed analysis including:
   - Vehicle count and types
   - Parking status (Proper/Improper)
   - Vehicle details (brand, model, plate number)
   - Orientation information

## 🔧 Configuration

### App Configuration

The app configuration is managed in `app.json`:

```json
{
  "expo": {
    "name": "AI Parking Inspector",
    "slug": "ai-parking-inspector",
    "version": "1.0.1",
    "android": {
      "package": "com.ddey78.aiparkinginspector",
      "versionCode": 2
    }
  }
}
```

### Build Configuration

Build profiles are configured in `eas.json`:

- **Development**: For testing with development client
- **Preview**: For internal testing (APK)
- **Production**: For app store distribution

## 📁 Project Structure

```
AI_Parking_Inspector/
├── components/           # React Native components
│   ├── HomeScreen.tsx
│   ├── ImageSelectionScreen.tsx
│   ├── ImageCroppingScreen.tsx
│   ├── ResultsScreen.tsx
│   └── SplashScreen.tsx
├── services/            # API and utility services
│   ├── api.ts          # Gemini AI integration
│   ├── imageUtils.ts   # Image processing utilities
│   └── storage.ts      # Local storage management
├── types/              # TypeScript type definitions
│   ├── index.ts
│   └── env.d.ts
├── utils/              # Utility functions and constants
│   └── constants.ts
├── assets/             # App assets (icons, images)
│   └── parkicon.png
├── App.tsx             # Main application component
├── app.json            # Expo configuration
├── eas.json            # EAS build configuration
└── package.json        # Dependencies and scripts
```

## 🤖 AI Features

### Vehicle Detection
- Detects multiple vehicles in a single image
- Filters out vehicles less than 40% visible
- Supports both two-wheelers and four-wheelers

### Parking Analysis
- Determines proper vs improper parking
- Analyzes vehicle orientation (Front/Rear/Side facing)
- Extracts vehicle identification details

### Image Processing
- Automatic image cropping and optimization
- Base64 encoding for API transmission
- Support for various image formats

## 🔐 Permissions

The app requires the following permissions:

- **Camera**: To capture images of parking areas
- **Storage**: To save and access images from gallery
- **Internet**: To communicate with Gemini AI API

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your Gemini API key is correctly set in the environment variables
2. **Build Failures**: Check that all dependencies are installed and EAS CLI is properly configured
3. **Image Processing Issues**: Ensure images are in supported formats (JPEG, PNG)

### Getting Help

If you encounter any issues:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review the [EAS Build documentation](https://docs.expo.dev/build/introduction/)
3. Open an issue in this repository

## 🚀 Future Enhancements

- [ ] Real-time video analysis
- [ ] Parking violation reporting
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with parking management systems

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Debashis Dey**
- GitHub: [@debashis-dey-78](https://github.com/debashis-dey-78)
- Project: [AI Parking Inspector](https://github.com/debashis-dey-78/AI_Parking_Inspector)

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- Expo team for the excellent development platform
- React Native community for continuous support

## 📞 Support

For support and questions, please open an issue in this repository or contact the author.

---

**Made with ❤️ using React Native and AI**
