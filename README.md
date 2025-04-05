# Early Disease Prediction Project

## Project Description
This repository contains our implementation of a disease prediction system using:
- Python with Deep Learning (CNN - Convolutional Neural Network)
- Image matching between input images and trained/tested dataset
- Cordova mobile app framework

## Technical Components

### Machine Learning Backend
- CNN model for image classification
- Trained on medical image dataset
- Prediction accuracy: [Add your metrics]

### Mobile App (Cordova)
```bash
# Cordova setup instructions:
1. Install Node.js (v18+ recommended)
2. Install Cordova: npm install -g cordova
3. Create project: cordova create nail_app
4. Add platforms: 
   cd nail_app
   cordova platform add android
   cordova platform add ios
5. Build: cordova build
6. Run: cordova run android
```

## Project Structure
```
/ (root)
├── README.md               - This file
├── Nail_app/               - Cordova mobile application
│   ├── config.xml          - App configuration
│   └── ...                 - Other Cordova files
├── ml_model/               - Machine learning components
│   ├── train.py            - Model training script
│   └── predict.py          - Prediction script
└── dataset/                - Training/test datasets
```

## Mobile App Development
- Edit `www/` files for frontend changes
- Plugins can be added via: `cordova plugin add [plugin-name]`
- Build after changes: `cordova build`