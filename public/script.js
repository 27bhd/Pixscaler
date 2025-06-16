// Pixscaler - Client-Side Image Resizer
// Built by Beniverse

let currentImage = null;
let originalFileName = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');

    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Quality slider handler
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    // Preset button handlers
    setupPresetButtons();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processImageFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            processImageFile(file);
        } else {
            showError('Please select an image file (JPEG, PNG, WebP, GIF)');
        }
    }
}

function processImageFile(file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        showError('Unsupported file type. Please use JPEG, PNG, WebP, or GIF.');
        return;
    }

    // Validate file size (50MB limit for client-side processing)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        showError('File too large. Please use files smaller than 50MB.');
        return;
    }

    originalFileName = file.name;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            currentImage = img;
            displayImageInfo(img);
            showControls();
        };
        img.onerror = function() {
            showError('Failed to load image. Please try a different file.');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayImageInfo(img) {
    // Set default dimensions to current image size
    document.getElementById('width').value = img.naturalWidth;
    document.getElementById('height').value = img.naturalHeight;
    
    // Show image info
    console.log(`📸 Image loaded: ${img.naturalWidth}x${img.naturalHeight}`);
}

function showControls() {
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
}

function setupPresetButtons() {
    // Preset button click handlers are already set in HTML onclick attributes
}

function setPreset(width, height) {
    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
}

function resizeImage() {
    if (!currentImage) {
        showError('Please select an image first');
        return;
    }

    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const quality = parseInt(document.getElementById('quality').value);
    const format = document.querySelector('input[name="format"]:checked').value;

    // Validate inputs
    if (!width || !height || width <= 0 || height <= 0) {
        showError('Please enter valid dimensions');
        return;
    }

    if (width > 8000 || height > 8000) {
        showError('Maximum dimensions are 8000x8000 pixels');
        return;
    }

    showLoading();

    // Use setTimeout to allow UI to update
    setTimeout(() => {
        try {
            const resizedImageData = performResize(currentImage, width, height, quality, format);
            showPreview(resizedImageData, width, height, format);
            hideLoading();
        } catch (error) {
            console.error('❌ Resize error:', error);
            showError('Failed to resize image: ' + error.message);
            hideLoading();
        }
    }, 100);
}

function performResize(img, targetWidth, targetHeight, quality, format) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw resized image
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Convert to desired format
    let mimeType;
    let qualityValue = quality / 100;

    switch (format) {
        case 'png':
            mimeType = 'image/png';
            qualityValue = undefined; // PNG doesn't use quality
            break;
        case 'webp':
            mimeType = 'image/webp';
            break;
        case 'jpeg':
        default:
            mimeType = 'image/jpeg';
            break;
    }

    // Get image data
    const dataURL = canvas.toDataURL(mimeType, qualityValue);
    
    return {
        dataURL: dataURL,
        blob: dataURLToBlob(dataURL),
        mimeType: mimeType,
        width: targetWidth,
        height: targetHeight
    };
}

function dataURLToBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function showPreview(imageData, width, height, format) {
    const previewSection = document.getElementById('preview');
    const previewImage = document.getElementById('previewImage');
    const downloadSection = document.getElementById('downloadSection');
    const downloadBtn = document.getElementById('downloadBtn');

    // Show preview
    previewImage.src = imageData.dataURL;
    previewSection.style.display = 'block';

    // Setup download
    const fileName = generateFileName(originalFileName, width, height, format);
    const url = URL.createObjectURL(imageData.blob);
    
    downloadBtn.href = url;
    downloadBtn.download = fileName;
    downloadSection.style.display = 'block';

    // Calculate file size reduction
    const originalSize = getOriginalFileSize();
    const newSize = imageData.blob.size;
    const reduction = originalSize ? Math.round((1 - newSize / originalSize) * 100) : 0;
    
    // Update success message with file info
    const successMessage = downloadSection.querySelector('p');
    successMessage.innerHTML = `
        Your image has been resized to ${width}x${height} pixels.<br>
        <small>Format: ${format.toUpperCase()} | Size: ${formatFileSize(newSize)}${reduction > 0 ? ` | ${reduction}% smaller` : ''}</small>
    `;

    console.log(`✅ Image resized successfully: ${width}x${height} (${format})`);
}

function generateFileName(originalName, width, height, format) {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const extension = format === 'jpeg' ? 'jpg' : format;
    return `${nameWithoutExt}_${width}x${height}.${extension}`;
}

function getOriginalFileSize() {
    const fileInput = document.getElementById('fileInput');
    return fileInput.files[0] ? fileInput.files[0].size : null;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('preview').style.display = 'none';
    document.getElementById('downloadSection').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showError(message) {
    alert('Pixscaler: ' + message);
    console.error('❌ Error:', message);
}

function resetUpload() {
    // Reset all states
    currentImage = null;
    originalFileName = '';
    
    // Reset UI
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('preview').style.display = 'none';
    document.getElementById('downloadSection').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    
    // Reset form
    document.getElementById('fileInput').value = '';
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
    document.getElementById('quality').value = 85;
    document.getElementById('qualityValue').textContent = '85%';
    document.querySelector('input[name="format"][value="jpeg"]').checked = true;
    
    console.log('🔄 Upload reset');
}

// Authentication functions (simplified for client-side)
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchModal(fromModal, toModal) {
    closeModal(fromModal);
    document.getElementById(toModal).style.display = 'flex';
}

// Simplified auth (no backend needed)
function logout() {
    console.log('Logout clicked');
    // In client-side version, just hide user info
    document.querySelector('.user-info').style.display = 'none';
    document.querySelector('.auth-buttons').style.display = 'flex';
}

// Form handlers (simplified)
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login functionality is disabled in the client-side version. All features are available without registration!');
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Registration functionality is disabled in the client-side version. All features are available without registration!');
        });
    }
});

console.log('🚀 Pixscaler Client-Side Edition loaded successfully!'); 