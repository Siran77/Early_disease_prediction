document.addEventListener('deviceready', onDeviceReady, false);

let model = null;

const ROBOFLOW_API_KEY = "Th8AoVB8JxnOaeLDTGw1";
const ROBOFLOW_MODEL_URL = "https://detect.roboflow.com/nail-disease-jmapt/1";

const NAIL_CONDITIONS = {
    'Onychomycosis': {
        description: 'A fungal infection of the nails that causes discoloration, thickening, and separation from the nail bed.',
        recommendation: 'Consult a dermatologist for antifungal treatment. Keep nails clean and dry.',
        chain_of_diseases: [
            'Secondary bacterial infections due to prolonged fungal infection.',
            'Chronic pain or discomfort in the affected nails.'
        ]
    },
    'Pachyonychia-Congenita': {
        description: 'A rare genetic condition causing thick, abnormal nails and other symptoms.',
        recommendation: 'Seek specialized medical care. Regular nail care and pain management may help.',
        chain_of_diseases: [
            'Skin lesions or painful calluses on pressure points.',
            'Difficulty in walking due to thickened skin on the soles.'
        ]
    },
    'Alopecia Areata': {
        description: 'An autoimmune condition affecting nails, causing pitting and ridging.',
        recommendation: 'Consult a dermatologist for treatment options and possible medications.',
        chain_of_diseases: [
            'Increased risk of other autoimmune disorders like thyroid disease.',
            'Emotional stress or depression due to appearance-related concerns.'
        ]
    },
    'Beau-Lines': {
        description: 'Horizontal depressions across the nails, often due to injury or illness.',
        recommendation: 'Monitor overall health and protect nails from trauma.',
        chain_of_diseases: [
            'Underlying systemic conditions like diabetes or infections.',
            'Nail deformities if left untreated.'
        ]
    },
    'Bluish-Nail': {
        description: 'Nails with a blue tint, indicating poor circulation or oxygen levels.',
        recommendation: 'Seek medical evaluation for underlying cardiovascular or respiratory issues.',
        chain_of_diseases: [
            'Chronic obstructive pulmonary disease (COPD).',
            'Heart failure or congenital heart defects.'
        ]
    },
    'Clubbing': {
        description: 'Enlarged fingertips and curved nails, often linked to lung or heart conditions.',
        recommendation: 'Immediate medical evaluation needed to identify underlying cause.',
        chain_of_diseases: [
            'Lung cancer or chronic lung infections.',
            'Congenital heart disease.'
        ]
    },
    'Darier-Disease': {
        description: 'A genetic disorder causing nail abnormalities and skin lesions.',
        recommendation: 'Consult a dermatologist for management strategies and treatments.',
        chain_of_diseases: [
            'Secondary bacterial infections from skin lesions.',
            'Eczema or dermatitis from skin irritation.'
        ]
    },
    'Eczema': {
        description: 'Inflammation affecting nails and surrounding skin.',
        recommendation: 'Use prescribed medications and maintain good nail hygiene.',
        chain_of_diseases: [
            'Asthma or allergic rhinitis (due to the atopic triad).',
            'Secondary skin infections (e.g., bacterial or viral).'
        ]
    },
    'Koilonychia': {
        description: 'Spoon-shaped nails, often associated with iron deficiency.',
        recommendation: 'Check iron levels and consider dietary supplements if prescribed.',
        chain_of_diseases: [
            'Iron deficiency anemia.',
            'Cardiac issues related to chronic anemia.'
        ]
    },
    'Leukonychia': {
        description: 'White spots or lines on nails, usually harmless.',
        recommendation: 'Monitor changes and maintain good nail care.',
        chain_of_diseases: [
            'Systemic diseases such as liver cirrhosis.',
            'Zinc deficiency.'
        ]
    },
    'Lindsay-Nails': {
        description: 'Half-and-half nails, often associated with kidney problems.',
        recommendation: 'Seek medical evaluation for kidney function.',
        chain_of_diseases: [
            'Chronic kidney disease.',
            'Hepatitis or other liver diseases.'
        ]
    },
    'Median': {
        description: 'Vertical ridges or splits in the nail plate.',
        recommendation: 'Protect nails from trauma and maintain good nutrition.',
        chain_of_diseases: [
            'Nutritional deficiencies (e.g., biotin or iron).',
            'Chronic systemic conditions affecting nail growth.'
        ]
    },
    'Melanoma': {
        description: 'Skin cancer affecting the nail unit, appearing as dark streaks.',
        recommendation: 'Immediate dermatological evaluation required.',
        chain_of_diseases: [
            'Metastatic spread of cancer if untreated.',
            'Chronic pain or nail loss.'
        ]
    },
    'Muehrck-Lines': {
        description: 'White lines across nails, often due to low protein or illness.',
        recommendation: 'Evaluate nutrition and underlying health conditions.',
        chain_of_diseases: [
            'Liver disease such as cirrhosis.',
            'Kidney disease due to fluid imbalance.'
        ]
    },
    'Normal': {
        description: 'Healthy nails without any pathological conditions.',
        recommendation: 'Continue good nail care practices.',
        chain_of_diseases: []
    },
    'Onychocryptosis': {
        description: 'Ingrown nails causing pain and inflammation.',
        recommendation: 'Proper nail trimming and possible podiatrist consultation.',
        chain_of_diseases: [
            'Infections due to prolonged irritation.',
            'Chronic pain or nail deformity.'
        ]
    },
    'Onychogryphosis': {
        description: 'Thickened, curved nails resembling rams horns.',
        recommendation: 'Regular professional nail care and medical evaluation.',
        chain_of_diseases: [
            'Nail bed infections.',
            'Chronic pain or discomfort.'
        ]
    },
    'Onycholysis': {
        description: 'Separation of nail from the nail bed.',
        recommendation: 'Keep nails dry and short, avoid trauma.',
        chain_of_diseases: [
            'Psoriasis (often seen in association).',
            'Thyroid disorders.'
        ]
    },
    'Pale-Nail': {
        description: 'Very light or white nails, possibly indicating anemia.',
        recommendation: 'Check blood counts and iron levels.',
        chain_of_diseases: [
            'Anemia (due to various causes).',
            'Heart failure.'
        ]
    },
    'Paronychia': {
        description: 'Infection of the tissue around the nail.',
        recommendation: 'Antibiotics may be needed, maintain dry clean nails.',
        chain_of_diseases: [
            'Chronic infections causing nail damage.',
            'Painful abscess formation.'
        ]
    },
    'Pseudomonas': {
        description: 'Bacterial infection causing green-black nail discoloration.',
        recommendation: 'Antibiotic treatment and keeping nails dry.',
        chain_of_diseases: [
            'Chronic nail infections.',
            'Nail loss or deformity.'
        ]
    },
    'Psoriasis': {
        description: 'Nail changes associated with psoriatic disease.',
        recommendation: 'Dermatological treatment and careful nail care.',
        chain_of_diseases: [
            'Arthritis (psoriatic arthritis).',
            'Chronic skin inflammation.'
        ]
    },
    'Red-Lunula': {
        description: 'Redness in the normally white half-moon area of nails.',
        recommendation: 'Medical evaluation for underlying conditions.',
        chain_of_diseases: [
            'Rheumatoid arthritis.',
            'Cardiovascular disease.'
        ]
    },
    'Splinter-Hemmorrage': {
        description: 'Thin dark lines under the nail, possible heart valve issues.',
        recommendation: 'Urgent medical evaluation recommended.',
        chain_of_diseases: [
            'Endocarditis (infection of heart lining).',
            'Vasculitis or autoimmune conditions.'
        ]
    },
    'Terry-Nails': {
        description: 'Mostly white nails with dark tips, linked to liver disease.',
        recommendation: 'Evaluate liver function and overall health.',
        chain_of_diseases: [
            'Liver cirrhosis.',
            'Congestive heart failure.'
        ]
    },
    'Trachyonychia': {
        description: 'Rough, sandpaper-like nail surface.',
        recommendation: 'Dermatological evaluation and gentle nail care.',
        chain_of_diseases: [
            'Psoriasis.',
            'Alopecia areata.'
        ]
    },
    'White-Nails': {
        description: 'Completely white nails, possible systemic condition.',
        recommendation: 'Medical evaluation for underlying causes.',
        chain_of_diseases: [
            'Liver failure.',
            'Nephrotic syndrome.'
        ]
    },
    'Yellow-Nails': {
        description: 'Yellow discoloration, often from infection or disease.',
        recommendation: 'Evaluate for fungal infection or systemic conditions.',
        chain_of_diseases: [
            'Respiratory issues like chronic bronchitis.',
            'Lymphedema.'
        ]
    }
};  

async function onDeviceReady() {
    console.log('Cordova is ready!');
    setupFileUploadListeners();
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove data URL prefix and get only base64 string
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}

// Helper function to find the matching condition key
function findMatchingCondition(predictedClass) {
    // Convert predicted class to lowercase for comparison
    const normalizedPredicted = predictedClass.toLowerCase();
    
    // First try exact match (case-insensitive)
    for (const key of Object.keys(NAIL_CONDITIONS)) {
        if (key.toLowerCase() === normalizedPredicted) {
            return key;
        }
    }

    // If no exact match, try without hyphens and spaces
    const strippedPredicted = normalizedPredicted.replace(/[-\s]/g, '');
    for (const key of Object.keys(NAIL_CONDITIONS)) {
        const strippedKey = key.toLowerCase().replace(/[-\s]/g, '');
        if (strippedKey === strippedPredicted) {
            return key;
        }
    }

    // If still no match, throw an error
    throw new Error(`Unknown condition detected: ${predictedClass}. Please try again with a different image.`);
}

// Process the image using Roboflow API
async function processImage(imageData) {
    try {
        showLoading();
        
        // Create URL with API key as query parameter
        const apiUrl = `${ROBOFLOW_MODEL_URL}?api_key=${ROBOFLOW_API_KEY}`;

        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        // Create form data
        const formData = new FormData();
        const blob = await fetch(`data:image/jpeg;base64,${imageData}`).then(res => res.blob());
        formData.append('file', blob, 'image.jpg');

        // Send the image data as multipart/form-data
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('API Response:', result);

        // Display results if any predictions exist
        if (result.predictions && result.predictions.length > 0) {
            const topPrediction = result.predictions[0];
            const predictedClass = topPrediction.class;
            const matchedCondition = findMatchingCondition(predictedClass);
            const confidence = topPrediction.confidence;

            // Display results
            displayResults({
                prediction: matchedCondition,
                description: NAIL_CONDITIONS[matchedCondition].description,
                confidence: confidence,
                recommendation: NAIL_CONDITIONS[matchedCondition].recommendation,
                chain_of_diseases: NAIL_CONDITIONS[matchedCondition].chain_of_diseases
            });
        } else {
            // If no predictions, display "Normal" condition
            displayResults({
                prediction: 'Normal',
                description: NAIL_CONDITIONS['Normal'].description,
                confidence: 1.0,
                recommendation: NAIL_CONDITIONS['Normal'].recommendation,
                chain_of_diseases: NAIL_CONDITIONS['Normal'].chain_of_diseases
            });
        }

    } catch (error) {
        console.error('Error processing image:', error);
        alert('Analysis failed: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Set up file upload functionality
function setupFileUploadListeners() {
    console.log('Setting up file upload listeners...');
    const fileInputs = document.querySelectorAll('input[type="file"]');

    console.log('Found file inputs:', fileInputs.length);

    fileInputs.forEach((input, index) => {
        console.log(`Setting up file input ${index + 1}`);
        input.addEventListener('change', (e) => {
            console.log('File input changed:', e.target.files[0]);
            handleFileSelect(e);
        });
    });
}

// Compress image to reduce size while maintaining quality
async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions while maintaining aspect ratio
                const maxDimension = 800; // Reduced from 1200 to 800 for better performance
                if (width > height && width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with reduced quality
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to compress image'));
                        return;
                    }
                    console.log('Compressed image size:', blob.size);
                    resolve(blob);
                }, 'image/jpeg', 0.8); // Increased quality to 0.8 (80%)
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

// Handle file selection
async function handleFileSelect(event) {
    console.log('Handling file selection...');
    const file = event.target.files[0];

    if (!file) {
        console.log('No file selected');
        return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type:', file.type);
        alert('Please select a valid image file (JPG or PNG)');
        return;
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
        alert('File size too large. Please select an image under 50MB.');
        return;
    }

    try {
        showLoading();
        console.log('Processing file...');
        
        let processedFile = file;
        
        // Compress image if larger than 50KB
        if (file.size > 50 * 1024) {
            console.log('Image larger than 50KB, compressing...');
            processedFile = await compressImage(file);
            console.log('Compressed file size:', processedFile.size);
        }
        
        // Convert file to base64
        const base64Data = await fileToBase64(processedFile);
        
        // Display preview
        const previewContainer = document.getElementById('previewContainer');
        const previewImage = document.getElementById('previewImage');
        const uploadArea = document.getElementById('uploadArea');
        
        if (previewContainer && previewImage) {
            console.log('Updating preview...');
            previewImage.src = `data:${file.type};base64,${base64Data}`;
            previewContainer.style.display = 'block';
            if (uploadArea) {
                uploadArea.style.display = 'none';
            }
            // Hide result section when new image is uploaded
            const resultSection = document.getElementById('resultSection');
            if (resultSection) {
                resultSection.style.display = 'none';
            }
        } else {
            throw new Error('Preview elements not found. Please refresh the page and try again.');
        }

        hideLoading();
    } catch (error) {
        console.error('Error in handleFileSelect:', error);
        alert('Error processing file: ' + error.message);
        hideLoading();
    }
}

// Display results
function displayResults(result) {
    const resultSection = document.getElementById('resultSection');
    const predictionResult = document.getElementById('predictionResult');
    const descriptionResult = document.getElementById('descriptionResult');
    const confidenceResult = document.getElementById('confidenceResult');
    const recommendationResult = document.getElementById('recommendationResult');
    const chainOfDiseasesResult = document.getElementById('chain_of_diseases');

    if (resultSection && predictionResult && descriptionResult && confidenceResult && recommendationResult && chainOfDiseasesResult) {
        predictionResult.textContent = result.prediction;
        descriptionResult.textContent = result.description;
        confidenceResult.textContent = `${(result.confidence * 100).toFixed(2)}%`;
        recommendationResult.textContent = result.recommendation;
        chainOfDiseasesResult.textContent = NAIL_CONDITIONS[result.prediction].chain_of_diseases || 'No chain of diseases information available';
        resultSection.style.display = 'block';
    }
}

// Loading indicator functions
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.alignItems = 'center';
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Reset upload
function resetUpload() {
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const resultSection = document.getElementById('resultSection');
    const uploadArea = document.getElementById('uploadArea');

    if (fileInput) {
        fileInput.value = '';
        console.log('File input reset');
    }
    if (previewContainer) {
        previewContainer.style.display = 'none';
        console.log('Preview container hidden');
    }
    if (resultSection) {
        resultSection.style.display = 'none';
        console.log('Result section hidden');
    }
    if (uploadArea) {
        uploadArea.style.display = 'block';
        console.log('Upload area shown');
    }
}

// Analyze image function for HTML onclick
async function analyzeImage() {
    const imagePreview = document.getElementById('previewImage');
    if (!imagePreview || !imagePreview.src) {
        alert('Please upload an image first');
        return;
    }

    // Check if we're on the child prediction page
    const childName = document.getElementById('childName');
    if (childName) {
        // Validate child information
        const childAge = document.getElementById('childAge').value;
        const childGender = document.getElementById('childGender').value;

        if (!childName.value || !childAge || !childGender) {
            alert('Please fill in all child information fields');
            return;
        }
    }

    try {
        showLoading();
        
        // Get base64 data from image preview
        const base64Data = imagePreview.src.split(',')[1];
        
        // Log the image data details
        console.log('Image data length:', base64Data.length);
        console.log('Image preview dimensions:', imagePreview.width, 'x', imagePreview.height);
        
        // Process the image using Roboflow API
        await processImage(base64Data);
    } catch (error) {
        console.error('Error analyzing image:', error);
        alert('Error analyzing image. Please try again.');
    } finally {
        hideLoading();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing app...');
    setupFileUploadListeners();
});

// Optimize image for mobile
function optimizeImageForMobile(file, callback) {
    const maxWidth = 800;  // Maximum width for mobile
    const maxHeight = 800; // Maximum height for mobile
    const quality = 0.7;   // Compression quality

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Resize if larger than max dimensions
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to WebP for better compression
            canvas.toBlob(function(blob) {
                callback(blob);
            }, 'image/webp', quality);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}
