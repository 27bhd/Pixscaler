// Mobile Pixscaler JavaScript
let selectedFiles = [];
let processedImages = [];
let isProcessing = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    
    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);
    
    // Upload area drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
    
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
        selectedFiles = files;
        showImageInfo();
        showSettings();
    }
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
        selectedFiles = files;
        showImageInfo();
        showSettings();
    }
}

// Show image info
function showImageInfo() {
    const imageInfo = document.getElementById('imageInfo');
    const fileCount = document.getElementById('fileCount');
    const totalSize = document.getElementById('totalSize');
    
    const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);
    
    fileCount.textContent = selectedFiles.length === 1 ? 
        '1 image selected' : 
        `${selectedFiles.length} images selected`;
    totalSize.textContent = `${totalMB} MB`;
    
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
    
    try {
        for (let i = 0; i < selectedFiles.length; i++) {
            if (!isProcessing) break; // Cancelled
            
            updateProgress(i, selectedFiles.length, `Processing ${selectedFiles[i].name}...`);
            
            const processedImage = await processImage(selectedFiles[i], width, height, quality, format);
            processedImages.push(processedImage);
            
            // Small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (isProcessing) {
            showResults();
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
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
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
    progressText.textContent = message || `Processing ${current + 1} of ${total} images...`;
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
function showResults() {
    const resultsSection = document.getElementById('resultsSection');
    const singleResult = document.getElementById('singleResult');
    const bulkResult = document.getElementById('bulkResult');
    
    resultsSection.style.display = 'block';
    
    if (processedImages.length === 1) {
        // Single image result
        singleResult.style.display = 'block';
        bulkResult.style.display = 'none';
        
        const previewImage = document.getElementById('previewImage');
        const downloadBtn = document.getElementById('downloadBtn');
        
        previewImage.src = URL.createObjectURL(processedImages[0].blob);
        
        downloadBtn.onclick = () => {
            downloadFile(processedImages[0].blob, processedImages[0].name);
        };
    } else {
        // Bulk result
        singleResult.style.display = 'none';
        bulkResult.style.display = 'block';
        
        const processedCount = document.getElementById('processedCount');
        const sizeSaved = document.getElementById('sizeSaved');
        
        const totalOriginalSize = processedImages.reduce((sum, img) => sum + img.originalSize, 0);
        const totalNewSize = processedImages.reduce((sum, img) => sum + img.newSize, 0);
        const percentSaved = Math.round((1 - totalNewSize / totalOriginalSize) * 100);
        
        processedCount.textContent = processedImages.length;
        sizeSaved.textContent = percentSaved > 0 ? `${percentSaved}%` : '0%';
    }
}

// Hide results
function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

// Download single file
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Download ZIP archive
async function downloadZip() {
    if (typeof JSZip === 'undefined') {
        showToast('ZIP functionality not available');
        return;
    }
    
    const zip = new JSZip();
    
    // Add all processed images to ZIP
    processedImages.forEach((img, index) => {
        zip.file(img.name, img.blob);
    });
    
    try {
        const zipBlob = await zip.generateAsync({type: 'blob'});
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        downloadFile(zipBlob, `pixscaler-images-${timestamp}.zip`);
    } catch (error) {
        console.error('ZIP creation error:', error);
        showToast('Error creating ZIP file');
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