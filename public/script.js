// Pixscaler - Advanced Client-Side Image Resizer
// Built by Beniverse - Now with Bulk Processing Support

// Global state management
let currentImages = [];
let processedImages = [];
let isProcessing = false;
let processingCancelled = false;
let totalBandwidthSaved = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateImageCounter();
    setupScrollEffects();
    setupSmartDropZone();
    setupKeyboardShortcuts();
    loadBandwidthStats();
});

function initializeApp() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');

    // File input change handler - supports multiple files
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop handlers for upload area
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
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        processFileSelection(files);
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
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
        // Filter only image files
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            processFileSelection(imageFiles);
        } else {
            showError('Please select image files (JPEG, PNG, WebP, GIF)');
        }
    }
}

function processFileSelection(files) {
    // Validate file types and sizes
    const validFiles = [];
    const maxSize = 50 * 1024 * 1024; // 50MB per file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
            showError(`Unsupported file type: ${file.name}. Please use JPEG, PNG, WebP, or GIF.`);
            continue;
        }
        
        if (file.size > maxSize) {
            showError(`File too large: ${file.name}. Please use files smaller than 50MB.`);
            continue;
        }
        
        validFiles.push(file);
    }
    
    if (validFiles.length === 0) {
        return;
    }
    
    // Load images
    loadImages(validFiles);
}

async function loadImages(files) {
    showLoading();
    currentImages = [];
    
    try {
        for (const file of files) {
            const imageData = await loadImageFile(file);
            currentImages.push(imageData);
        }
        
        hideLoading();
        setupUI();
        
    } catch (error) {
        hideLoading();
        showError('Failed to load images: ' + error.message);
    }
}

function loadImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                resolve({
                    file: file,
                    image: img,
                    originalSize: file.size,
                    name: file.name
                });
            };
            img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
    });
}

function setupUI() {
    const isBulk = currentImages.length > 1;
    
    // Update UI elements based on mode
    updateUIForMode(isBulk);
    
    // Set default dimensions from first image
    if (currentImages.length > 0) {
        const firstImage = currentImages[0].image;
        document.getElementById('width').value = firstImage.naturalWidth;
        document.getElementById('height').value = firstImage.naturalHeight;
    }
    
    // Show controls
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    
    // Show bulk info if multiple files
    if (isBulk) {
        showBulkInfo();
    }
}

function updateUIForMode(isBulk) {
    const uploadText = document.getElementById('uploadText');
    const controlsTitle = document.getElementById('controlsTitle');
    const modeIndicator = document.getElementById('modeIndicator');
    const resizeBtnText = document.getElementById('resizeBtnText');
    
    if (isBulk) {
        uploadText.textContent = 'Drag & drop your images here';
        controlsTitle.textContent = '📦 Bulk Processing Settings';
        modeIndicator.textContent = `${currentImages.length} images`;
        modeIndicator.style.display = 'block';
        resizeBtnText.textContent = `Process ${currentImages.length} Images`;
    } else {
        uploadText.textContent = 'Drag & drop your image here';
        controlsTitle.textContent = '📐 Image Settings';
        modeIndicator.style.display = 'none';
        resizeBtnText.textContent = 'Resize Image';
    }
}

function showBulkInfo() {
    const bulkInfo = document.getElementById('bulkInfo');
    const fileCount = document.getElementById('fileCount');
    const totalSize = document.getElementById('totalSize');
    
    const totalBytes = currentImages.reduce((sum, img) => sum + img.originalSize, 0);
    
    fileCount.textContent = currentImages.length;
    totalSize.textContent = formatFileSize(totalBytes);
    bulkInfo.style.display = 'flex';
}

function clearSelection() {
    currentImages = [];
    processedImages = [];
    resetUpload();
}

function setupPresetButtons() {
    // Preset button click handlers are already set in HTML onclick attributes
}

function setPreset(width, height) {
    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
}

async function processImages() {
    if (currentImages.length === 0) {
        showError('Please select images first');
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
    
    const isBulk = currentImages.length > 1;
    
    if (isBulk) {
        await processBulkImages(width, height, quality, format);
    } else {
        await processSingleImage(width, height, quality, format);
    }
}

async function processSingleImage(width, height, quality, format) {
    showLoading();
    
    try {
        const imageData = currentImages[0];
        const resizedData = performResize(imageData.image, width, height, quality, format);
        
        hideLoading();
        showSinglePreview(resizedData, width, height, format, imageData.name);
        
    } catch (error) {
        hideLoading();
        showError('Failed to resize image: ' + error.message);
    }
}

async function processBulkImages(width, height, quality, format) {
    isProcessing = true;
    processingCancelled = false;
    processedImages = [];
    
    // Hide controls and show progress
    document.getElementById('controls').style.display = 'none';
    document.getElementById('bulkProgress').style.display = 'block';
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressTime = document.getElementById('progressTime');
    const progressDetails = document.getElementById('progressDetails');
    
    const totalImages = currentImages.length;
    const startTime = Date.now();
    
    try {
        for (let i = 0; i < totalImages; i++) {
            if (processingCancelled) {
                break;
            }
            
            const imageData = currentImages[i];
            const progress = ((i + 1) / totalImages) * 100;
            
            // Update progress
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Processing ${i + 1} of ${totalImages} images...`;
            
            // Calculate estimated time
            const elapsed = Date.now() - startTime;
            const avgTimePerImage = elapsed / (i + 1);
            const remaining = (totalImages - i - 1) * avgTimePerImage;
            progressTime.textContent = `Estimated time: ${formatTime(remaining)}`;
            
            // Add processing detail
            const detail = document.createElement('div');
            detail.textContent = `✓ Processing ${imageData.name}...`;
            progressDetails.appendChild(detail);
            progressDetails.scrollTop = progressDetails.scrollHeight;
            
            try {
                // Process image
                const resizedData = performResize(imageData.image, width, height, quality, format);
                const fileName = generateFileName(imageData.name, width, height, format);
                
                processedImages.push({
                    ...resizedData,
                    originalName: imageData.name,
                    fileName: fileName,
                    originalSize: imageData.originalSize
                });
                
                detail.textContent = `✅ ${imageData.name} → ${fileName}`;
                
            } catch (error) {
                detail.textContent = `❌ Failed: ${imageData.name} (${error.message})`;
            }
            
            // Small delay to prevent browser freeze
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (!processingCancelled) {
            // Processing complete
            progressFill.style.width = '100%';
            progressText.textContent = `Completed ${processedImages.length} of ${totalImages} images`;
            progressTime.textContent = 'Processing complete!';
            
            // Show download section after a brief delay
            setTimeout(() => {
                document.getElementById('bulkProgress').style.display = 'none';
                showBulkDownload();
            }, 1000);
        }
        
    } catch (error) {
        showError('Bulk processing failed: ' + error.message);
        document.getElementById('bulkProgress').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
    }
    
    isProcessing = false;
}

function cancelProcessing() {
    processingCancelled = true;
    isProcessing = false;
    
    document.getElementById('bulkProgress').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    
    showDonationToast('Processing cancelled');
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
            qualityValue = null; // PNG doesn't use quality parameter - more explicit than undefined
            break;
        case 'webp':
            mimeType = 'image/webp';
            break;
        case 'jpeg':
        default:
            mimeType = 'image/jpeg';
            break;
    }

    // Get image data with proper error handling
    try {
        const dataURL = canvas.toDataURL(mimeType, qualityValue);
        
        return {
            dataURL: dataURL,
            blob: dataURLToBlob(dataURL),
            mimeType: mimeType,
            width: targetWidth,
            height: targetHeight
        };
    } catch (error) {
        throw new Error(`Failed to generate image data: ${error.message}`);
    }
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

function showSinglePreview(imageData, width, height, format, originalName) {
    const previewSection = document.getElementById('preview');
    const previewImage = document.getElementById('previewImage');
    const downloadSection = document.getElementById('downloadSection');
    const downloadTitle = document.getElementById('downloadTitle');
    const downloadDescription = document.getElementById('downloadDescription');
    const singleDownload = document.getElementById('singleDownload');
    const bulkDownload = document.getElementById('bulkDownload');
    const downloadBtn = document.getElementById('downloadBtn');

    // Show preview
    previewImage.src = imageData.dataURL;
    previewSection.style.display = 'block';

    // Setup single download
    downloadTitle.textContent = 'Image Resized Successfully!';
    downloadDescription.textContent = 'Your image has been processed with professional optimization.';
    
    singleDownload.style.display = 'block';
    bulkDownload.style.display = 'none';
    
    const fileName = generateFileName(originalName, width, height, format);
    const url = URL.createObjectURL(imageData.blob);
    
    downloadBtn.href = url;
    downloadBtn.download = fileName;
    downloadSection.style.display = 'block';
    
    // Calculate file size reduction
    const originalSize = currentImages[0].originalSize;
    const newSize = imageData.blob.size;
    const reduction = originalSize ? Math.round((1 - newSize / originalSize) * 100) : 0;
    
    // Update success message with file info
    downloadDescription.innerHTML = `
        Your image has been resized to ${width}x${height} pixels.<br>
        <small>Format: ${format.toUpperCase()} | Size: ${formatFileSize(newSize)}${reduction > 0 ? ` | ${reduction}% smaller` : ''}</small>
    `;

    // Increment usage counter
    incrementImageCounter();

    // Check achievements
    checkAchievements(originalSize, newSize);
}

function showBulkDownload() {
    const downloadSection = document.getElementById('downloadSection');
    const downloadTitle = document.getElementById('downloadTitle');
    const downloadDescription = document.getElementById('downloadDescription');
    const singleDownload = document.getElementById('singleDownload');
    const bulkDownload = document.getElementById('bulkDownload');
    const processedCount = document.getElementById('processedCount');
    const totalSaved = document.getElementById('totalSaved');
    const zipSize = document.getElementById('zipSize');

    // Calculate statistics
    const totalOriginalSize = processedImages.reduce((sum, img) => sum + img.originalSize, 0);
    const totalNewSize = processedImages.reduce((sum, img) => sum + img.blob.size, 0);
    const totalReduction = totalOriginalSize ? Math.round((1 - totalNewSize / totalOriginalSize) * 100) : 0;

    // Update UI
    downloadTitle.textContent = 'Images Processed Successfully!';
    downloadDescription.textContent = 'Your images have been processed with professional optimization.';
    
    singleDownload.style.display = 'none';
    bulkDownload.style.display = 'block';
    
    processedCount.textContent = processedImages.length;
    totalSaved.textContent = `${totalReduction}%`;
    zipSize.textContent = formatFileSize(totalNewSize);
    
    downloadSection.style.display = 'block';

    // Increment usage counter for bulk
    for (let i = 0; i < processedImages.length; i++) {
        incrementImageCounter();
    }
}

async function downloadZip() {
    if (!window.JSZip) {
        showError('ZIP library not loaded. Please refresh the page.');
        return;
    }
    
    try {
        const zip = new JSZip();
        
        // Add all processed images to ZIP
        for (const imageData of processedImages) {
            zip.file(imageData.fileName, imageData.blob);
        }
        
        // Generate ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        // Download ZIP
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pixscaler_resized_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showDonationToast('ZIP download started! 📦');
        
    } catch (error) {
        showError('Failed to create ZIP: ' + error.message);
    }
}

function generateFileName(originalName, width, height, format) {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const extension = format === 'jpeg' ? 'jpg' : format;
    return `${nameWithoutExt}_${width}x${height}.${extension}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(ms) {
    if (ms < 1000) return 'Less than a second';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
}

function resetUpload() {
    // Reset all states
    currentImages = [];
    processedImages = [];
    isProcessing = false;
    processingCancelled = false;
    
    // Clean up memory - revoke any existing object URLs
    try {
        document.querySelectorAll('a[href^="blob:"]').forEach(link => {
            URL.revokeObjectURL(link.href);
        });
        
        const previewImage = document.getElementById('previewImage');
        if (previewImage && previewImage.src.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage.src);
            previewImage.src = '';
        }
    } catch (error) {
        console.warn('Error cleaning up object URLs:', error);
    }
    
    // Reset UI
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('bulkInfo').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('bulkProgress').style.display = 'none';
    document.getElementById('preview').style.display = 'none';
    document.getElementById('downloadSection').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    
    // Reset form values
    document.getElementById('fileInput').value = '';
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
    document.getElementById('quality').value = 85;
    document.getElementById('qualityValue').textContent = '85%';
    
    // Reset upload text
    document.getElementById('uploadText').textContent = 'Drag & drop your images here';
    
    // Force garbage collection hint
    if (window.gc) {
        window.gc();
    }
}

// Smart Drop Zone - Make entire page a drop zone
function setupSmartDropZone() {
    let dragCounter = 0;
    
    // Prevent default drag behaviors on entire document
    document.addEventListener('dragenter', function(e) {
        e.preventDefault();
        dragCounter++;
        if (dragCounter === 1) {
            document.body.classList.add('drag-active');
        }
    });
    
    document.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            document.body.classList.remove('drag-active');
        }
    });
    
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        dragCounter = 0;
        document.body.classList.remove('drag-active');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                processFileSelection(imageFiles);
            } else {
                showError('Please drop image files (JPEG, PNG, WebP, GIF)');
            }
        }
    });
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Toggle help with '?'
        if (e.key === '?' && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            toggleKeyboardHelp();
            return;
        }
        
        // Ctrl + O: Upload images
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            document.getElementById('fileInput').click();
            return;
        }
        
        // Ctrl + Enter: Process images
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (currentImages.length > 0) {
                processImages();
            }
            return;
        }
        
        // Ctrl + R: Reset (override browser refresh)
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (currentImages.length > 0) {
                resetUpload();
            }
            return;
        }
        
        // Escape: Cancel processing
        if (e.key === 'Escape' && isProcessing) {
            e.preventDefault();
            cancelProcessing();
            return;
        }
        
        // Number keys 1-4: Quick presets
        if (!e.ctrlKey && !e.altKey && currentImages.length > 0) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    setPreset(1920, 1080);
                    break;
                case '2':
                    e.preventDefault();
                    setPreset(1280, 720);
                    break;
                case '3':
                    e.preventDefault();
                    setPreset(800, 600);
                    break;
                case '4':
                    e.preventDefault();
                    setPreset(400, 400);
                    break;
            }
        }
    });
}

function toggleKeyboardHelp() {
    const helpElement = document.querySelector('.keyboard-shortcuts');
    if (helpElement) {
        helpElement.classList.toggle('show');
    } else {
        // Create help overlay
        const help = document.createElement('div');
        help.className = 'keyboard-shortcuts show';
        help.innerHTML = `
            <h4>⌨️ Keyboard Shortcuts</h4>
            <div class="shortcut"><span>Ctrl + O</span><span>Upload Images</span></div>
            <div class="shortcut"><span>Ctrl + Enter</span><span>Process Images</span></div>
            <div class="shortcut"><span>Ctrl + R</span><span>Reset</span></div>
            <div class="shortcut"><span>Escape</span><span>Cancel Processing</span></div>
            <div class="shortcut"><span>1-4</span><span>Quick Presets</span></div>
            <div class="shortcut"><span>?</span><span>Toggle Help</span></div>
        `;
        document.body.appendChild(help);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (help.parentNode) {
                help.parentNode.removeChild(help);
            }
        }, 5000);
    }
}

function showAchievement(icon, text, detail) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = `
        <span class="achievement-icon">${icon}</span>
        <div class="achievement-text">${text}</div>
        <div class="achievement-detail">${detail}</div>
    `;
    
    document.body.appendChild(achievement);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (achievement.parentNode) {
            achievement.parentNode.removeChild(achievement);
        }
    }, 4000);
}

function checkAchievements(originalSize, newSize) {
    const reduction = originalSize ? Math.round((1 - newSize / originalSize) * 100) : 0;
    
    if (reduction >= 50) {
        showAchievement('🏆', 'Space Saver!', `${reduction}% size reduction achieved`);
    } else if (reduction >= 25) {
        showAchievement('💾', 'Efficient!', `${reduction}% smaller file size`);
    }
    
    // Check processing count
    const stats = JSON.parse(localStorage.getItem('pixscaler_stats') || '{"count": 0}');
    if (stats.count === 10) {
        showAchievement('🎯', 'Getting Started!', '10 images processed');
    } else if (stats.count === 50) {
        showAchievement('🚀', 'Power User!', '50 images processed');
    } else if (stats.count === 100) {
        showAchievement('⭐', 'Expert!', '100 images processed');
    }
}

function loadBandwidthStats() {
    const saved = localStorage.getItem('pixscaler_bandwidth');
    if (saved) {
        totalBandwidthSaved = parseInt(saved) || 0;
    }
}

function saveBandwidthStats() {
    localStorage.setItem('pixscaler_bandwidth', totalBandwidthSaved.toString());
}

function shareSuccess() {
    const text = "Just resized images with Pixscaler - amazing quality and completely free!";
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Pixscaler Success',
            text: text,
            url: url
        }).catch(() => {
            fallbackShare(text, url);
        });
    } else {
        fallbackShare(text, url);
    }
}

function fallbackShare(text, url) {
    // Copy to clipboard and show options
    const fullText = `${text} ${url}`;
    navigator.clipboard.writeText(fullText).then(() => {
        showDonationToast('Share text copied to clipboard! 📋');
        
        // Show social media options
        setTimeout(() => {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            
            showDonationToast(`Share on: <a href="${twitterUrl}" target="_blank" style="color: #1da1f2;">Twitter</a> | <a href="${linkedinUrl}" target="_blank" style="color: #0077b5;">LinkedIn</a>`);
        }, 2000);
    }).catch(() => {
        showDonationToast('Unable to copy to clipboard 😅');
    });
}

// Usage counter functions
function updateImageCounter() {
    try {
        const count = loadImageCounter();
        // Remove reference to non-existent imageCount element
        // const imageCountElement = document.getElementById('imageCount');
        // if (imageCountElement) {
        //     imageCountElement.textContent = count.toLocaleString();
        // }
        
        // Update localStorage
        localStorage.setItem('pixscaler_image_count', count.toString());
        
        // Update social proof if element exists
        updateSocialProof();
    } catch (error) {
        console.warn('Failed to update image counter:', error);
    }
}

function loadImageCounter() {
    try {
        return parseInt(localStorage.getItem('pixscaler_image_count') || '0');
    } catch (error) {
        return 0;
    }
}

function incrementImageCounter() {
    try {
        const currentCount = loadImageCounter();
        const newCount = currentCount + 1;
        localStorage.setItem('pixscaler_image_count', newCount.toString());
        
        // Remove reference to non-existent counterElement
        // const counterElement = document.getElementById('imageCount');
        // if (counterElement) {
        //     counterElement.style.animation = 'countUp 0.5s ease-out';
        //     counterElement.textContent = newCount.toLocaleString();
        //     
        //     setTimeout(() => {
        //         counterElement.style.animation = '';
        //     }, 500);
        // }
        
        // Update social proof
        updateSocialProof();
        
        // Show achievement for milestones
        if (newCount === 10 || newCount === 50 || newCount === 100 || newCount % 500 === 0) {
            showAchievement('🎉', `${newCount} Images Processed!`, 'You\'re becoming a pro!');
        }
    } catch (error) {
        console.warn('Failed to increment image counter:', error);
    }
}

// Scroll effects
function setupScrollEffects() {
    // Remove reference to non-existent floatingBadge element
    // const floatingBadge = document.getElementById('floatingBadge');
    // if (!floatingBadge) return;
    
    // Simplified scroll effects without non-existent elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Apply parallax effect to existing elements only
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

function updateSocialProof() {
    try {
        const totalProcessed = loadImageCounter();
        
        // Remove reference to non-existent totalElement
        // const totalElement = document.getElementById('totalProcessed');
        // if (totalElement) {
        //     totalElement.textContent = totalProcessed.toLocaleString();
        // }
        
        // Remove reference to non-existent imageCountElement  
        // const imageCountElement = document.getElementById('imageCount');
        // if (imageCountElement) {
        //     imageCountElement.textContent = totalProcessed.toLocaleString();
        // }
        
        // Update page title with count if significant
        if (totalProcessed > 0) {
            document.title = `Pixscaler - ${totalProcessed.toLocaleString()} Images Processed`;
        }
    } catch (error) {
        console.warn('Failed to update social proof:', error);
    }
}

// Modal functions (for legacy modal elements)
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function switchModal(fromModal, toModal) {
    const fromElement = document.getElementById(fromModal);
    const toElement = document.getElementById(toModal);
    
    if (fromElement) {
        fromElement.style.display = 'none';
    }
    if (toElement) {
        toElement.style.display = 'block';
    }
}

// Donation functions
function copyAddress() {
    const address = document.getElementById('solanaAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
        showDonationToast('Solana address copied! 🚀');
    }).catch(() => {
        showDonationToast('Failed to copy address 😅');
    });
}

function showDonationMessage(amount) {
    const messages = {
        0.01: "☕ Coffee money! Every pixel thanks you!",
        0.05: "🥤 Soda fuel! The code runs smoother now!",
        0.1: "🍕 Pizza power! You're keeping the developer fed!",
        0.25: "🚀 Rocket fuel! You're a legend in the pixel universe!"
    };
    
    showDonationToast(messages[amount] || "Thanks for considering a donation! 💖");
}

function showDonationToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'donation-toast';
    toast.innerHTML = message;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Donation section functions
function shareProject() {
    const text = "Check out Pixscaler - a free, professional image resizer that works entirely in your browser!";
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Pixscaler - Professional Image Resizer',
            text: text,
            url: url
        }).catch(() => {
            fallbackShare(text, url);
        });
    } else {
        fallbackShare(text, url);
    }
}

// Legacy function aliases for backward compatibility
function resizeImage() {
    processImages();
} 