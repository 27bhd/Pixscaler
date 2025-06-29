// Mobile Pixscaler JavaScript
let selectedFiles = [];
let processedImages = [];
let isProcessing = false;

// Detect iOS device
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = document.getElementById('uploadButton');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    
    // iOS detection kept for download compatibility
    // (Warning removed per user request)
    
    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);
    
    // Upload button click handler (better iOS compatibility)
    uploadButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });
    
    // Upload area click handler
    uploadArea.addEventListener('click', function(e) {
        // Only trigger if not clicking the button directly
        if (e.target !== uploadButton && !uploadButton.contains(e.target)) {
            fileInput.click();
        }
    });
    
    // Touch event handlers for better iOS support
    uploadArea.addEventListener('touchstart', function(e) {
        if (e.target !== uploadButton && !uploadButton.contains(e.target)) {
            e.preventDefault();
        }
    });
    
    uploadArea.addEventListener('touchend', function(e) {
        if (e.target !== uploadButton && !uploadButton.contains(e.target)) {
            e.preventDefault();
            fileInput.click();
        }
    });
    
    // Upload area drag and drop (for desktop compatibility)
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Quality slider update
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });
    
    // Dimension inputs sync
    setupDimensionSync();
});

// Handle file selection
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        // Take only the first file for mobile
        const file = files[0];
        
        if (isValidImageFile(file)) {
            selectedFiles = [file]; // Always single file array
            showImageInfo();
            showSettings();
        } else {
            showToast('Please select a valid image file (JPEG, PNG, WebP, GIF, HEIC)');
        }
    }
}

// Check if file is a valid image
function isValidImageFile(file) {
    const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/heic',
        'image/heif'
    ];
    
    const validExtensions = [
        '.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'
    ];
    
    // Check MIME type
    if (validTypes.includes(file.type.toLowerCase())) {
        return true;
    }
    
    // Fallback: check file extension (for HEIC files that might not have proper MIME type)
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
        // Take only the first file for mobile
        const file = files[0];
        if (isValidImageFile(file)) {
            selectedFiles = [file];
            showImageInfo();
            showSettings();
        } else {
            showToast('Please select a valid image file');
        }
    }
}

// Show image info
function showImageInfo() {
    const imageInfo = document.getElementById('imageInfo');
    const fileCount = document.getElementById('fileCount');
    const totalSize = document.getElementById('totalSize');
    
    const file = selectedFiles[0]; // Always single file
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    
    fileCount.textContent = '1 image selected';
    totalSize.textContent = `${fileMB} MB`;
    
    imageInfo.style.display = 'block';
}

// Show settings panel
function showSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    settingsPanel.style.display = 'block';
}

// Clear selection
function clearSelection() {
    selectedFiles = [];
    document.getElementById('fileInput').value = '';
    document.getElementById('imageInfo').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    hideResults();
}

// Set preset dimensions
function setPreset(width, height) {
    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
    
    // Visual feedback
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
        if (btn.textContent === `${width}×${height}`) {
            btn.style.background = 'rgba(102, 126, 234, 0.3)';
            btn.style.borderColor = '#667eea';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 300);
        }
    });
}

// Setup dimension input synchronization
function setupDimensionSync() {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    
    let aspectRatio = null;
    let lockAspectRatio = false;
    
    widthInput.addEventListener('input', function() {
        if (lockAspectRatio && aspectRatio && this.value) {
            heightInput.value = Math.round(this.value / aspectRatio);
        }
    });
    
    heightInput.addEventListener('input', function() {
        if (lockAspectRatio && aspectRatio && this.value) {
            widthInput.value = Math.round(this.value * aspectRatio);
        }
    });
}

// Process images
async function processImages() {
    if (selectedFiles.length === 0) return;
    
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const quality = parseInt(document.getElementById('quality').value) / 100;
    const format = document.querySelector('input[name="format"]:checked').value;
    
    if (!width || !height) {
        showToast('Please enter valid dimensions');
        return;
    }
    
    isProcessing = true;
    showProgress();
    processedImages = [];
    
    // Start timing
    const startTime = Date.now();
    
    try {
        const file = selectedFiles[0]; // Single file processing
        
        updateProgress(0, 1, `Processing ${file.name}...`);
        
        const processedImage = await processImage(file, width, height, quality, format);
        processedImages.push(processedImage);
        
        if (isProcessing) {
            // Calculate processing time
            const processingTimeMs = Date.now() - startTime;
            showResults(processingTimeMs);
        }
    } catch (error) {
        console.error('Processing error:', error);
        showToast('Error processing images. Please try again.');
    } finally {
        isProcessing = false;
        hideProgress();
    }
}

// Process single image
function processImage(file, width, height, quality, format) {
    return new Promise((resolve, reject) => {
        // Check if this is a HEIC file
        const isHEIC = file.type === 'image/heic' || file.type === 'image/heif' || 
                       file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
        
        if (isHEIC) {
            // For HEIC files, provide simple guidance
            reject(new Error('HEIC format not supported. Please convert to JPEG or PNG first.'));
            return;
        }
        
        const img = new Image();
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Draw and resize image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        const originalName = file.name.split('.')[0];
                        const extension = format === 'jpeg' ? 'jpg' : format;
                        const newName = `${originalName}_${width}x${height}.${extension}`;
                        
                        resolve({
                            blob: blob,
                            name: newName,
                            originalSize: file.size,
                            newSize: blob.size,
                            width: width,
                            height: height
                        });
                    } else {
                        reject(new Error('Failed to process image'));
                    }
                }, `image/${format}`, quality);
                
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image. Please make sure the file is a valid image format.'));
        };
        
        try {
            img.src = URL.createObjectURL(file);
        } catch (error) {
            reject(new Error('Failed to read image file. Please try selecting the image again.'));
        }
    });
}

// Show progress
function showProgress() {
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('progressSection').style.display = 'block';
}

// Update progress
function updateProgress(current, total, message) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = ((current + 1) / total) * 100;
    progressFill.style.width = percentage + '%';
    progressText.textContent = message || 'Processing image...';
}

// Hide progress
function hideProgress() {
    document.getElementById('progressSection').style.display = 'none';
}

// Cancel processing
function cancelProcessing() {
    isProcessing = false;
    hideProgress();
    document.getElementById('settingsPanel').style.display = 'block';
}

// Show results
function showResults(processingTimeMs = 0) {
    const resultsSection = document.getElementById('resultsSection');
    const singleResult = document.getElementById('singleResult');
    
    resultsSection.style.display = 'block';
    
    // Always single image result on mobile
    singleResult.style.display = 'block';
    
    const previewImage = document.getElementById('previewImage');
    const downloadBtn = document.getElementById('downloadBtn');
    
    previewImage.src = URL.createObjectURL(processedImages[0].blob);
    
    downloadBtn.onclick = () => {
        downloadFile(processedImages[0].blob, processedImages[0].name);
    };
}

// Format processing time
function formatProcessingTime(ms) {
    if (ms < 1000) {
        return `${ms}ms`;
    } else if (ms < 60000) {
        return `${(ms / 1000).toFixed(1)}s`;
    } else {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
}

// Hide results
function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

// Download single file with iOS compatibility
function downloadFile(blob, filename) {
    if (isIOS()) {
        // iOS Safari specific handling
        downloadFileIOS(blob, filename);
    } else {
        // Standard download for other browsers
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// iOS-specific download function
function downloadFileIOS(blob, filename) {
    try {
        // Try Web Share API (works on iOS 12+)
        if (navigator.share && navigator.canShare) {
            const file = new File([blob], filename, { type: blob.type });
            
            if (navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: filename,
                    text: `Download ${filename} from Pixscaler`
                }).then(() => {
                    showToast('✅ Choose "Save to Files" to download your image!');
                }).catch((error) => {
                    if (error.name !== 'AbortError') {
                        showToast('Download ready! Check your Files app or try again.');
                    }
                });
                return;
            }
        }
        
        // Simple fallback: try standard download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Download started! Check your Downloads folder.');
        
    } catch (error) {
        console.error('iOS download error:', error);
        showToast('Download ready! Please try again or check your Downloads folder.');
    }
}







// Reset upload
function resetUpload() {
    clearSelection();
    hideResults();
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Hide modal
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Navigation handlers
function showAbout() {
    showModal('aboutModal');
}

function showDesktopVersion() {
    if (confirm('Switch to desktop version?')) {
        // Set flag to prevent auto-redirect back to mobile
        localStorage.setItem('forceDesktop', 'true');
        window.location.href = 'index.html';
    }
}

function showSupport() {
    showModal('supportModal');
}

// Copy wallet address
function copyAddress() {
    const address = document.getElementById('solanaAddress').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(address).then(() => {
            showToast('Address copied to clipboard!');
        }).catch(() => {
            fallbackCopy(address);
        });
    } else {
        fallbackCopy(address);
    }
}

// Fallback copy function
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Address copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy address');
    }
    
    document.body.removeChild(textArea);
}

// Share app
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'Pixscaler - Mobile Image Resizer',
            text: 'Check out this awesome image resizer tool!',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback to copying URL
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Link copied to clipboard!');
            });
        }
    }
}

// Open GitHub
function openGitHub() {
    window.open('https://github.com/27bhd/Pixscaler', '_blank');
}

// Open Freelancer profile
function openFreelancer() {
    window.open('https://www.freelancer.com/u/Beniverse', '_blank');
}

// Show donation message
function showDonationMessage(amount) {
    showToast(`Please send ${amount} SOL to the address above. Thank you for your support! 🙏`);
}

// Show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 10000;
        max-width: 80%;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
});

// Prevent zoom on form inputs (iOS)
document.addEventListener('touchstart', function() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        setTimeout(() => {
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
        }, 500);
    }
}); 