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
        // Filter and validate files
        const validFiles = [];
        const invalidFiles = [];
        
        files.forEach(file => {
            if (isValidImageFile(file)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file.name);
            }
        });
        
        if (invalidFiles.length > 0) {
            showToast(`Unsupported files: ${invalidFiles.join(', ')}`);
        }
        
        if (validFiles.length > 0) {
            selectedFiles = validFiles;
            showImageInfo();
            showSettings();
        } else {
            showToast('Please select valid image files (JPEG, PNG, WebP, GIF, HEIC)');
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
    
    // Start timing
    const startTime = Date.now();
    
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
function showResults(processingTimeMs = 0) {
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
        const processingTimeStat = document.getElementById('processingTimeStat');
        const processingTime = document.getElementById('processingTime');
        
        const totalOriginalSize = processedImages.reduce((sum, img) => sum + img.originalSize, 0);
        const totalNewSize = processedImages.reduce((sum, img) => sum + img.newSize, 0);
        const percentSaved = Math.round((1 - totalNewSize / totalOriginalSize) * 100);
        
        processedCount.textContent = processedImages.length;
        sizeSaved.textContent = percentSaved > 0 ? `${percentSaved}%` : '0%';
        
        // Show processing time if file size is large (> 5MB) or many images (> 10)
        const shouldShowTime = totalOriginalSize > 5 * 1024 * 1024 || processedImages.length > 10;
        
        if (shouldShowTime && processingTimeMs > 0) {
            processingTimeStat.style.display = 'block';
            processingTime.textContent = formatProcessingTime(processingTimeMs);
        } else {
            processingTimeStat.style.display = 'none';
        }
    }
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
        // Method 1: Try Web Share API first (works on iOS 12+)
        if (navigator.share && navigator.canShare) {
            const file = new File([blob], filename, { type: blob.type });
            
            if (navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: filename,
                    text: `Download ${filename} from Pixscaler`
                }).then(() => {
                    showToast('File shared successfully! Choose "Save to Files" to download.');
                }).catch((error) => {
                    if (error.name !== 'AbortError') {
                        console.log('Share failed, trying alternative method');
                        downloadFileIOSAlternative(blob, filename);
                    }
                });
                return;
            }
        }
        
        // Method 2: Alternative approach if share API fails
        downloadFileIOSAlternative(blob, filename);
        
    } catch (error) {
        console.error('iOS download error:', error);
        downloadFileIOSAlternative(blob, filename);
    }
}

// Alternative iOS download method
function downloadFileIOSAlternative(blob, filename) {
    try {
        // Convert blob to data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            
            // Method 1: Try creating a temporary link with data URL
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            link.style.display = 'none';
            
            // Add to DOM and click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show instructions
            setTimeout(() => {
                showIOSDownloadInstructions(filename);
            }, 500);
        };
        
        reader.onerror = function() {
            // Final fallback: open in new tab
            openImageInNewTab(blob, filename);
        };
        
        reader.readAsDataURL(blob);
        
    } catch (error) {
        console.error('iOS alternative download error:', error);
        openImageInNewTab(blob, filename);
    }
}

// Open image in new tab for manual save
function openImageInNewTab(blob, filename) {
    try {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            const newWindow = window.open('', '_blank');
            
            if (newWindow) {
                newWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${filename}</title>
                        <style>
                            body {
                                margin: 0;
                                padding: 20px;
                                background: #000;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                min-height: 100vh;
                                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                            }
                            img {
                                max-width: 100%;
                                max-height: 80vh;
                                object-fit: contain;
                                border-radius: 8px;
                                box-shadow: 0 4px 20px rgba(255,255,255,0.1);
                            }
                            .instructions {
                                color: white;
                                text-align: center;
                                margin-top: 20px;
                                font-size: 16px;
                                line-height: 1.5;
                            }
                            .filename {
                                color: #007AFF;
                                font-weight: 600;
                                margin-bottom: 10px;
                            }
                            .steps {
                                background: rgba(255,255,255,0.1);
                                padding: 15px;
                                border-radius: 8px;
                                margin-top: 15px;
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${dataUrl}" alt="${filename}">
                        <div class="instructions">
                            <div class="filename">${filename}</div>
                            <div class="steps">
                                📱 <strong>To save this image:</strong><br>
                                1. Tap and hold the image above<br>
                                2. Select "Save to Photos" or "Add to Photos"<br>
                                3. The image will be saved to your Photos app
                            </div>
                        </div>
                    </body>
                    </html>
                `);
                newWindow.document.close();
                showToast('Image opened in new tab. Tap and hold to save!');
            } else {
                showToast('Please allow popups to download images');
            }
        };
        reader.readAsDataURL(blob);
    } catch (error) {
        console.error('Error opening image in new tab:', error);
        showToast('Download failed. Please try again.');
    }
}

// Show iOS-specific download instructions
function showIOSDownloadInstructions(filename) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        ">
            <h3 style="margin: 0 0 16px 0; color: #007AFF;">📱 Download Instructions</h3>
            <p style="margin: 0 0 20px 0; color: #333; line-height: 1.5;">
                <strong>${filename}</strong><br><br>
                If the download didn't start automatically:
            </p>
            <ol style="text-align: left; color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                <li>Check your Downloads folder in the Files app</li>
                <li>Or look for the file in Safari's download manager</li>
                <li>If not found, the image may have opened in a new tab - tap and hold it to save to Photos</li>
            </ol>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #007AFF;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
            ">Got it!</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 10000);
}



// Download ZIP archive
async function downloadZip() {
    if (typeof JSZip === 'undefined') {
        showToast('ZIP functionality not available');
        return;
    }
    
    // For iOS, show options since ZIP downloads can be tricky
    if (isIOS() && processedImages.length > 1) {
        showIOSDownloadOptions();
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

// Show iOS download options modal
function showIOSDownloadOptions() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        ">
            <h3 style="margin: 0 0 16px 0; color: #007AFF;">📱 Download Options</h3>
            <p style="margin: 0 0 20px 0; color: #333; line-height: 1.5;">
                You have ${processedImages.length} images to download. Choose your preferred method:
            </p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="downloadImagesIndividually(); this.parentElement.parentElement.parentElement.remove();" style="
                    background: #007AFF;
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">📱 Download One by One (Recommended)</button>
                <button onclick="tryZipDownloadIOS(); this.parentElement.parentElement.parentElement.remove();" style="
                    background: #34C759;
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">📦 Try ZIP Download</button>
                <button onclick="this.parentElement.parentElement.parentElement.remove();" style="
                    background: #8E8E93;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                ">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Try ZIP download on iOS
async function tryZipDownloadIOS() {
    if (typeof JSZip === 'undefined') {
        showToast('ZIP functionality not available');
        return;
    }
    
    showToast('Creating ZIP file...');
    
    const zip = new JSZip();
    
    // Add all processed images to ZIP
    processedImages.forEach((img, index) => {
        zip.file(img.name, img.blob);
    });
    
    try {
        const zipBlob = await zip.generateAsync({type: 'blob'});
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `pixscaler-images-${timestamp}.zip`;
        
        // Try Web Share API for ZIP files
        if (navigator.share && navigator.canShare) {
            const file = new File([zipBlob], filename, { type: 'application/zip' });
            
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: filename,
                        text: `Download ${processedImages.length} images from Pixscaler`
                    });
                    showToast('ZIP file shared! Choose "Save to Files" to download.');
                    return;
                } catch (shareError) {
                    if (shareError.name !== 'AbortError') {
                        console.log('ZIP share failed, trying fallback');
                    }
                }
            }
        }
        
        // Fallback to regular download
        downloadFile(zipBlob, filename);
        
    } catch (error) {
        console.error('ZIP creation error:', error);
        showToast('ZIP creation failed. Try downloading images individually.');
        downloadImagesIndividually();
    }
}

// Download images individually (iOS fallback)
function downloadImagesIndividually() {
    if (processedImages.length === 0) {
        showToast('No images to download');
        return;
    }
    
    let currentIndex = 0;
    
    function downloadNext() {
        if (currentIndex < processedImages.length) {
            const img = processedImages[currentIndex];
            downloadFile(img.blob, img.name);
            currentIndex++;
            
            // Show progress
            showToast(`Downloaded ${currentIndex} of ${processedImages.length} images`);
            
            // Small delay before next download to prevent overwhelming the browser
            setTimeout(() => {
                downloadNext();
            }, 1000);
        } else {
            showToast('All images downloaded! 🎉');
        }
    }
    
    downloadNext();
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