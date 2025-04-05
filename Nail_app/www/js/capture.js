// Image capture and compression functionality
class ImageHandler {
    constructor() {
        this.video = null;
        this.stream = null;
        this.canvas = null;
        this.ctx = null;
        this.maxWidth = 800; // Maximum width for compressed image
        this.maxHeight = 600; // Maximum height for compressed image
        this.quality = 0.7; // JPEG quality (0.0 to 1.0)
    }

    // Initialize video capture
    async initializeCamera() {
        try {
            this.video = document.createElement('video');
            this.video.autoplay = true;
            this.video.playsInline = true;
            
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            
            this.video.srcObject = this.stream;
            return this.video;
        } catch (error) {
            console.error('Error accessing camera:', error);
            throw error;
        }
    }

    // Create canvas for image processing
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // Compress image
    compressImage(imageData) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > this.maxWidth) {
                        height = Math.round((height * this.maxWidth) / width);
                        width = this.maxWidth;
                    }
                } else {
                    if (height > this.maxHeight) {
                        width = Math.round((width * this.maxHeight) / height);
                        height = this.maxHeight;
                    }
                }

                // Set canvas dimensions
                this.canvas.width = width;
                this.canvas.height = height;

                // Draw and compress image
                this.ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed JPEG
                const compressedDataUrl = this.canvas.toDataURL('image/jpeg', this.quality);
                resolve(compressedDataUrl);
            };
            img.src = imageData;
        });
    }

    // Capture image from video
    async captureImage() {
        if (!this.canvas) {
            this.createCanvas();
        }

        // Set canvas dimensions to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        // Draw current video frame on canvas
        this.ctx.drawImage(this.video, 0, 0);

        // Get image data and compress
        const imageData = this.canvas.toDataURL('image/jpeg');
        return await this.compressImage(imageData);
    }

    // Stop camera stream
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.video) {
            this.video.srcObject = null;
            this.video = null;
        }
    }

    // Handle file upload and compression
    async handleFileUpload(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Please upload an image file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const compressedImage = await this.compressImage(e.target.result);
                    resolve(compressedImage);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsDataURL(file);
        });
    }
}

// Export the ImageHandler class
window.ImageHandler = ImageHandler; 