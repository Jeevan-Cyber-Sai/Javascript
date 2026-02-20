# AR Health Awareness & First-Aid Guide

A socially impactful WebAR application that guides users step-by-step to perform correct first aid (especially CPR) using augmented reality overlays, voice instructions, and real-time feedback.

## 🎯 Features

### Core Features
- **Home Screen**: Clean, modern medical-themed UI with emergency type selection
- **WebAR Camera Module**: WebXR/Three.js-based AR with camera access
- **CPR AR Guidance**: 
  - Animated hand placement overlay on chest area
  - Compression rhythm indicator (100-120 BPM)
  - Step-by-step instructions panel
  - Large visual cues suitable for panic situations
- **Voice Guidance**: 
  - Step-by-step audio instructions using Web Speech API
  - Multilingual support (English, Hindi, Tamil)
  - Repeat instruction functionality
- **Pose Detection**: 
  - MediaPipe Pose integration for hand position detection
  - Real-time feedback on hand placement
- **Emergency Features**:
  - One-tap ambulance call button (112 for India)
  - Help arrival countdown timer
  - User data storage

### Authentication
- User login and registration
- JWT-based authentication
- User data persistence

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AR**: Three.js, WebXR
- **AI/Vision**: MediaPipe Pose
- **Audio**: Web Speech API
- **State Management**: Zustand
- **Backend**: Next.js API Routes
- **Authentication**: JWT, bcryptjs

## 📦 Installation

1. **Clone the repository**:
   ```bash
   cd ar-health-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   Create a `.env.local` file:
   ```env
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### First Time Setup
1. Navigate to the login page
2. Create an account or login with existing credentials
3. Select your preferred language (English, Hindi, Tamil)

### Using CPR AR Guidance
1. From the home screen, select **CPR**
2. Review the instructions preview
3. Click **Start AR Guidance**
4. Grant camera permissions when prompted
5. Follow the on-screen AR overlays and voice instructions
6. Use the pose detection feedback to ensure correct hand placement
7. Follow the compression rhythm (100-120 BPM)

### Emergency Types
- **CPR**: Full AR guidance with pose detection
- **Choking**: Step-by-step text instructions
- **Bleeding**: Step-by-step text instructions
- **Burns**: Step-by-step text instructions

## 📱 Mobile Support

The app is optimized for mobile devices:
- Responsive design for all screen sizes
- Mobile-first UI with large touch targets
- Camera access optimized for mobile devices
- Works on mid-range Android phones

## 🌐 Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Safari**: Full support (iOS 11+)
- **Firefox**: Full support
- **Opera**: Full support

**Note**: WebAR requires HTTPS or localhost. For production, deploy with SSL certificate.

## 🔒 Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- User data is stored in-memory (replace with database in production)
- Camera access requires user permission

## 🏗️ Project Structure

```
ar-health-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   └── users/route.ts
│   ├── ar/
│   │   └── [type]/page.tsx
│   ├── home/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ARView.tsx
│   ├── CPRGuide.tsx
│   ├── EmergencyGuides.tsx
│   └── PoseDetector.tsx
├── lib/
│   ├── store.ts
│   └── translations.ts
└── README.md
```

## 🎨 Design Principles

- **Calm & Trustworthy**: Medical-themed color palette (red, white, blue)
- **High Contrast**: Large buttons and text for stress situations
- **Accessible**: Clear visual cues and voice guidance
- **Non-gamified**: Professional, life-saving focus

## 🔮 Future Enhancements

- [ ] Offline PWA support
- [ ] Confidence score meter
- [ ] Pediatric/adult toggle
- [ ] Multi-language voice pack download
- [ ] Dark mode
- [ ] Database integration (replace in-memory storage)
- [ ] Location sharing with emergency services
- [ ] AR guidance for other emergency types

## 📝 Notes

- **Mock Emergency Mode**: The app includes a demo mode for testing
- **Camera Permissions**: Users must grant camera access for AR features
- **Performance**: Optimized for 4G networks and mid-range devices
- **Production**: Replace in-memory user storage with a proper database

## 🤝 Contributing

This is a socially impactful project. Contributions are welcome!

## 📄 License

This project is created for educational and social impact purposes.

## 🆘 Emergency Numbers

- **India**: 112 (Unified Emergency Number) or 108 (Ambulance)
- **USA**: 911
- **UK**: 999
- **Australia**: 000

**Always call emergency services in real emergencies!**
