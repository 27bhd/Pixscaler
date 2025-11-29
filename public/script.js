/**
 * Pixscaler - Advanced Client-Side Image Resizer
 * Built by Benchehida Abdelatif
 * https://www.linkedin.com/in/benchehida-abdelatif-97b377369/
 * 
 * Features: Bulk Processing, ZIP Downloads, Privacy-First Architecture
 */

// Use shared utilities
const { 
    CONFIG, 
    isSupportedImageFile, 
    isHeicFile, 
    convertHeicFile, 
    formatFileSize, 
    formatProcessingTime, 
    formatTimeRemaining,
    generateFileName,
    yieldToMainThread,
    cleanupCanvas,
    loadImageFromFile
} = window.PixscalerUtils;

// Donation address
const SOLANA_ADDRESS = '5Ap6T93SRLFj9Urg7SWk1As5nNDunb6zEzyw8fpSUuHo';

// Application state
let currentImages = [];
let processedImages = [];
let isProcessing = false;
let processingCancelled = false;
let previewObjectUrl = null;
let scrollTicking = false;

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateImageCounter();
    setupScrollEffects();
    setupSmartDropZone();
    setupKeyboardShortcuts();
    setupEventListeners();
});

function initializeApp() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const solanaAddressEl = document.getElementById('solanaAddress');

    if (solanaAddressEl) {
        solanaAddressEl.textContent = SOLANA_ADDRESS;
    }

    fileInput.addEventListener('change', handleFileSelect);
    
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Accessibility: Keyboard support for upload area
    uploadArea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    qualitySlider.addEventListener('input', function() {
        const value = this.value;
        qualityValue.textContent = value + '%';
        this.style.setProperty('--value', value + '%');
    });
    
    const initialValue = qualitySlider.value;
    qualityValue.textContent = initialValue + '%';
    qualitySlider.style.setProperty('--value', initialValue + '%');
}

/**
 * Set up all button event listeners (replacing inline onclick)
 */
function setupEventListeners() {
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent;
            const match = text.match(/(\d+)×(\d+)/);
            if (match) {
                setPreset(parseInt(match[1]), parseInt(match[2]));
            }
        });
    });

    // Upload button
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            document.getElementById('fileInput').click();
        });
    }

    // Resize button
    const resizeBtn = document.getElementById('resizeBtn');
    if (resizeBtn) {
        resizeBtn.addEventListener('click', processImages);
    }

    // Clear button
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSelection);
    }

    // Cancel button
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelProcessing);
    }

    // Download ZIP button
    const downloadZipBtn = document.getElementById('downloadZipBtn');
    if (downloadZipBtn) {
        downloadZipBtn.addEventListener('click', downloadZip);
    }

    // New image button
    const newImageBtn = document.querySelector('.new-image-btn');
    if (newImageBtn) {
        newImageBtn.addEventListener('click', resetUpload);
    }

    // Copy address button
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyAddress);
    }

    // Donation amount buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = parseFloat(this.textContent);
            showDonationMessage(amount);
        });
    });

    // Alternative support options
    document.querySelectorAll('.alt-support span').forEach(span => {
        span.addEventListener('click', function() {
            const text = this.textContent;
            if (text.includes('Share')) {
                shareProject();
            } else if (text.includes('GitHub')) {
                window.open('https://github.com/27bhd/Pixscaler', '_blank');
            } else if (text.includes('LinkedIn')) {
                window.open('https://www.linkedin.com/in/benchehida-abdelatif-97b377369/', '_blank');
            }
        });
    });
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
        // Use proper file type checking that handles HEIC
        const imageFiles = files.filter(file => isSupportedImageFile(file));
        if (imageFiles.length > 0) {
            processFileSelection(imageFiles);
        } else {
            showError('Please select image files (JPEG, PNG, WebP, GIF, HEIC)');
        }
    }
}

function processFileSelection(files) {
    const validFiles = [];
    
    for (const file of files) {
        if (!isSupportedImageFile(file)) {
            showError('Unsupported file type: ' + file.name + '. Please use JPEG, PNG, WebP, GIF, or HEIC.');
            continue;
        }
        
        if (file.size > CONFIG.MAX_FILE_SIZE_BYTES) {
            showError('File too large: ' + file.name + '. Please use files smaller than 50MB.');
            continue;
        }
        
        validFiles.push(file);
    }
    
    if (validFiles.length === 0) {
        return;
    }
    
    loadImages(validFiles);
}

async function loadImages(files) {
    showLoading();
    try {
        currentImages = await Promise.all(files.map(loadImageFile));
        hideLoading();
        setupUI();
        
    } catch (error) {
        hideLoading();
        showError('Failed to load images: ' + error.message);
    }
}

async function loadImageFile(file) {
    let workingFile = file;
    if (isHeicFile(file)) {
        workingFile = await convertHeicFile(file);
    }
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        let objectUrl;
        
        img.onload = function() {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
            resolve({
                file: workingFile,
                image: img,
                originalSize: file.size,
                name: workingFile.name || file.name,
                originalName: file.name
            });
        };
        
        img.onerror = function() {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
            reject(new Error('Failed to load ' + (workingFile.name || file.name)));
        };
        
        objectUrl = URL.createObjectURL(workingFile);
        img.src = objectUrl;
    });
}

function setupUI() {
    const isBulk = currentImages.length > 1;
    
    updateUIForMode(isBulk);
    
    if (currentImages.length > 0) {
        const firstImage = currentImages[0].image;
        document.getElementById('width').value = firstImage.naturalWidth;
        document.getElementById('height').value = firstImage.naturalHeight;
    }
    
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    
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
        modeIndicator.textContent = currentImages.length + ' images';
        modeIndicator.style.display = 'block';
        resizeBtnText.textContent = 'Process ' + currentImages.length + ' Images';
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
    
    if (!width || !height || width <= 0 || height <= 0) {
        showError('Please enter valid dimensions');
        return;
    }

    if (width > CONFIG.MAX_DIMENSION_PX || height > CONFIG.MAX_DIMENSION_PX) {
        showError('Maximum dimensions are ' + CONFIG.MAX_DIMENSION_PX + 'x' + CONFIG.MAX_DIMENSION_PX + ' pixels');
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
    
    const startTime = Date.now();
    
    try {
        const imageData = currentImages[0];
        const resizedData = await performResize(imageData.image, width, height, quality, format);
        
        const processingTime = Date.now() - startTime;
        
        hideLoading();
        showSinglePreview(resizedData, width, height, format, imageData.originalName || imageData.name, processingTime, imageData.originalSize);
        
    } catch (error) {
        hideLoading();
        showError('Failed to resize image: ' + error.message);
    }
}

async function processBulkImages(width, height, quality, format) {
    isProcessing = true;
    processingCancelled = false;
    processedImages = [];
    
    document.getElementById('controls').style.display = 'none';
    document.getElementById('bulkProgress').style.display = 'block';
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressTime = document.getElementById('progressTime');
    const progressDetails = document.getElementById('progressDetails');
    progressDetails.innerHTML = '';
    
    const totalImages = currentImages.length;
    const startTime = Date.now();
    
    try {
        for (let i = 0; i < totalImages; i++) {
            if (processingCancelled) {
                break;
            }
            
            const imageData = currentImages[i];
            const progress = ((i + 1) / totalImages) * 100;
            
            progressFill.style.width = progress + '%';
            progressText.textContent = 'Processing ' + (i + 1) + ' of ' + totalImages + ' images...';
            
            const elapsed = Date.now() - startTime;
            const avgTimePerImage = elapsed / (i + 1);
            const remaining = (totalImages - i - 1) * avgTimePerImage;
            progressTime.textContent = 'Estimated time: ' + formatTimeRemaining(remaining);
            
            const detail = document.createElement('div');
            detail.textContent = '✓ Processing ' + imageData.name + '...';
            progressDetails.appendChild(detail);
            progressDetails.scrollTop = progressDetails.scrollHeight;
            
            try {
                const resizedData = await performResize(imageData.image, width, height, quality, format);
                const fileName = generateFileName(imageData.originalName || imageData.name, width, height, format);
                
                processedImages.push({
                    ...resizedData,
                    originalName: imageData.originalName || imageData.name,
                    fileName: fileName,
                    originalSize: imageData.originalSize
                });
                
                detail.textContent = '✅ ' + imageData.name + ' → ' + fileName;
                
            } catch (error) {
                detail.textContent = '❌ Failed: ' + imageData.name + ' (' + error.message + ')';
            }
            
            await yieldToMainThread();
        }
        
        if (!processingCancelled) {
            const totalProcessingTime = Date.now() - startTime;
            progressFill.style.width = '100%';
            progressText.textContent = 'Completed ' + processedImages.length + ' of ' + totalImages + ' images';
            progressTime.textContent = 'Processing complete!';
            
            setTimeout(function() {
                document.getElementById('bulkProgress').style.display = 'none';
                showBulkDownload(totalProcessingTime);
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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    let mimeType;
    let qualityValue = quality / 100;

    switch (format) {
        case 'png':
            mimeType = 'image/png';
            qualityValue = null;
            break;
        case 'webp':
            mimeType = 'image/webp';
            break;
        case 'jpeg':
        default:
            mimeType = 'image/jpeg';
            break;
    }

    return new Promise((resolve, reject) => {
        canvas.toBlob(function(blob) {
            // Clean up canvas to free memory
            cleanupCanvas(canvas, ctx);
            
            if (!blob) {
                reject(new Error('Failed to generate image data'));
                return;
            }
            resolve({
                blob: blob,
                mimeType: mimeType,
                width: targetWidth,
                height: targetHeight
            });
        }, mimeType, qualityValue === null ? undefined : qualityValue);
    });
}

function showSinglePreview(imageData, width, height, format, originalName, processingTimeMs, originalSize) {
    const previewSection = document.getElementById('preview');
    const previewImage = document.getElementById('previewImage');
    const downloadSection = document.getElementById('downloadSection');
    const downloadTitle = document.getElementById('downloadTitle');
    const downloadDescription = document.getElementById('downloadDescription');
    const singleDownload = document.getElementById('singleDownload');
    const bulkDownload = document.getElementById('bulkDownload');
    const downloadBtn = document.getElementById('downloadBtn');

    if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
    }
    previewObjectUrl = URL.createObjectURL(imageData.blob);
    previewImage.src = previewObjectUrl;
    previewSection.style.display = 'block';

    downloadTitle.textContent = 'Image Resized Successfully!';
    downloadDescription.textContent = 'Your image has been processed with professional optimization.';
    
    singleDownload.style.display = 'block';
    bulkDownload.style.display = 'none';
    
    const fileName = generateFileName(originalName, width, height, format);
    const url = URL.createObjectURL(imageData.blob);
    
    downloadBtn.href = url;
    downloadBtn.download = fileName;
    downloadSection.style.display = 'block';
    
    const actualOriginalSize = originalSize || currentImages[0].originalSize;
    const newSize = imageData.blob.size;
    const reduction = actualOriginalSize ? Math.round((1 - newSize / actualOriginalSize) * 100) : 0;
    
    let descriptionHTML = 'Your image has been resized to ' + width + 'x' + height + ' pixels.<br>';
    let smallText = 'Format: ' + format.toUpperCase() + ' | Size: ' + formatFileSize(newSize);
    
    if (reduction > 0) {
        smallText += ' | ' + reduction + '% smaller';
    }
    
    if (actualOriginalSize > CONFIG.LARGE_FILE_THRESHOLD_BYTES && processingTimeMs > 0) {
        smallText += ' | Processed in ' + formatProcessingTime(processingTimeMs);
    }
    
    downloadDescription.innerHTML = descriptionHTML + '<small>' + smallText + '</small>';

    incrementImageCounter();
    checkAchievements(actualOriginalSize, newSize);
}

function showBulkDownload(processingTimeMs) {
    const downloadSection = document.getElementById('downloadSection');
    const downloadTitle = document.getElementById('downloadTitle');
    const downloadDescription = document.getElementById('downloadDescription');
    const singleDownload = document.getElementById('singleDownload');
    const bulkDownload = document.getElementById('bulkDownload');
    const processedCount = document.getElementById('processedCount');
    const totalSaved = document.getElementById('totalSaved');
    const zipSize = document.getElementById('zipSize');
    const processingTimeStatDesktop = document.getElementById('processingTimeStatDesktop');
    const processingTimeDesktop = document.getElementById('processingTimeDesktop');

    const totalOriginalSize = processedImages.reduce(function(sum, img) { return sum + img.originalSize; }, 0);
    const totalNewSize = processedImages.reduce(function(sum, img) { return sum + img.blob.size; }, 0);
    const totalReduction = totalOriginalSize ? Math.round((1 - totalNewSize / totalOriginalSize) * 100) : 0;

    downloadTitle.textContent = 'Images Processed Successfully!';
    downloadDescription.textContent = 'Your images have been processed with professional optimization.';
    
    singleDownload.style.display = 'none';
    bulkDownload.style.display = 'block';
    
    processedCount.textContent = processedImages.length;
    totalSaved.textContent = totalReduction + '%';
    zipSize.textContent = formatFileSize(totalNewSize);
    
    const shouldShowTime = totalOriginalSize > CONFIG.LARGE_FILE_THRESHOLD_BYTES || processedImages.length > 10;
    
    if (shouldShowTime && processingTimeMs > 0) {
        processingTimeStatDesktop.style.display = 'block';
        processingTimeDesktop.textContent = formatProcessingTime(processingTimeMs);
    } else {
        processingTimeStatDesktop.style.display = 'none';
    }
    
    downloadSection.style.display = 'block';

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
        
        for (const imageData of processedImages) {
            zip.file(imageData.fileName, imageData.blob);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pixscaler_resized_' + Date.now() + '.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showDonationToast('ZIP download started! 📦');
        
    } catch (error) {
        showError('Failed to create ZIP: ' + error.message);
    }
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
    showDonationToast('⚠️ ' + message);
}

function resetUpload() {
    currentImages = [];
    processedImages = [];
    isProcessing = false;
    processingCancelled = false;
    
    try {
        document.querySelectorAll('a[href^="blob:"]').forEach(function(link) {
            URL.revokeObjectURL(link.href);
        });
        
        const previewImage = document.getElementById('previewImage');
        if (previewImage && previewImage.src.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage.src);
            previewImage.src = '';
        }
        previewObjectUrl = null;
    } catch (error) {
        console.warn('Error cleaning up object URLs:', error);
    }
    
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('bulkInfo').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('bulkProgress').style.display = 'none';
    document.getElementById('preview').style.display = 'none';
    document.getElementById('downloadSection').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    
    document.getElementById('fileInput').value = '';
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
    
    const qualitySlider = document.getElementById('quality');
    qualitySlider.value = CONFIG.DEFAULT_QUALITY;
    qualitySlider.style.setProperty('--value', CONFIG.DEFAULT_QUALITY + '%');
    document.getElementById('qualityValue').textContent = CONFIG.DEFAULT_QUALITY + '%';
    
    document.getElementById('uploadText').textContent = 'Drag & drop your images here';
    
    // Hint for garbage collection
    if (window.gc) {
        window.gc();
    }
}

function setupSmartDropZone() {
    let dragCounter = 0;
    const dragAnnounce = document.getElementById('dragAnnounce');
    
    document.addEventListener('dragenter', function(e) {
        e.preventDefault();
        dragCounter++;
        if (dragCounter === 1) {
            document.body.classList.add('drag-active');
            if (dragAnnounce) {
                dragAnnounce.textContent = 'Drop your image anywhere on the page to start resizing.';
            }
        }
    });
    
    document.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            document.body.classList.remove('drag-active');
            if (dragAnnounce) {
                dragAnnounce.textContent = '';
            }
        }
    });
    
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        dragCounter = 0;
        document.body.classList.remove('drag-active');
        if (dragAnnounce) {
            dragAnnounce.textContent = '';
        }
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            // Use proper file type checking that handles HEIC
            const imageFiles = files.filter(function(file) { 
                return isSupportedImageFile(file); 
            });
            if (imageFiles.length > 0) {
                processFileSelection(imageFiles);
            } else {
                showError('Please drop image files (JPEG, PNG, WebP, GIF, HEIC)');
            }
        }
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.key === '?' && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            toggleKeyboardHelp();
            return;
        }
        
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            document.getElementById('fileInput').click();
            return;
        }
        
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (currentImages.length > 0) {
                processImages();
            }
            return;
        }
        
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (currentImages.length > 0) {
                resetUpload();
            }
            return;
        }
        
        if (e.key === 'Escape' && isProcessing) {
            e.preventDefault();
            cancelProcessing();
            return;
        }
        
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
        const help = document.createElement('div');
        help.className = 'keyboard-shortcuts show';
        help.innerHTML = '<h4>⌨️ Keyboard Shortcuts</h4>' +
            '<div class="shortcut"><span>Ctrl + O</span><span>Upload Images</span></div>' +
            '<div class="shortcut"><span>Ctrl + Enter</span><span>Process Images</span></div>' +
            '<div class="shortcut"><span>Ctrl + R</span><span>Reset</span></div>' +
            '<div class="shortcut"><span>Escape</span><span>Cancel Processing</span></div>' +
            '<div class="shortcut"><span>1-4</span><span>Quick Presets</span></div>' +
            '<div class="shortcut"><span>?</span><span>Toggle Help</span></div>';
        document.body.appendChild(help);
        
        setTimeout(function() {
            if (help.parentNode) {
                help.parentNode.removeChild(help);
            }
        }, 5000);
    }
}

function showAchievement(icon, text, detail) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = '<span class="achievement-icon">' + icon + '</span>' +
        '<div class="achievement-text">' + text + '</div>' +
        '<div class="achievement-detail">' + detail + '</div>';
    
    document.body.appendChild(achievement);
    
    setTimeout(function() {
        if (achievement.parentNode) {
            achievement.parentNode.removeChild(achievement);
        }
    }, 4000);
}

function checkAchievements(originalSize, newSize) {
    const reduction = originalSize ? Math.round((1 - newSize / originalSize) * 100) : 0;
    
    if (reduction >= 50) {
        showAchievement('🏆', 'Space Saver!', reduction + '% size reduction achieved');
    } else if (reduction >= 25) {
        showAchievement('💾', 'Efficient!', reduction + '% smaller file size');
    }
    
    const totalProcessed = loadImageCounter();
    if (totalProcessed === 10) {
        showAchievement('🎯', 'Getting Started!', '10 images processed');
    } else if (totalProcessed === 50) {
        showAchievement('🚀', 'Power User!', '50 images processed');
    } else if (totalProcessed === 100) {
        showAchievement('⭐', 'Expert!', '100 images processed');
    }
}

function fallbackShare(text, url) {
    const fullText = text + ' ' + url;
    navigator.clipboard.writeText(fullText).then(function() {
        showDonationToast('Share text copied to clipboard! 📋');
        
        setTimeout(function() {
            const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
            const linkedinUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
            
            showDonationToast('Share on: <a href="' + twitterUrl + '" target="_blank" style="color: #1da1f2;">Twitter</a> | <a href="' + linkedinUrl + '" target="_blank" style="color: #0077b5;">LinkedIn</a>');
        }, 2000);
    }).catch(function() {
        showDonationToast('Unable to copy to clipboard 😅');
    });
}

function updateImageCounter() {
    try {
        const count = loadImageCounter();
        localStorage.setItem('pixscaler_image_count', count.toString());
        updateSocialProof();
    } catch (error) {
        console.warn('Failed to update image counter:', error);
    }
}

function loadImageCounter() {
    try {
        const stored = parseInt(localStorage.getItem('pixscaler_image_count') || '0', 10);
        return Number.isNaN(stored) ? 0 : stored;
    } catch (error) {
        return 0;
    }
}

function incrementImageCounter() {
    try {
        const currentCount = loadImageCounter();
        const newCount = currentCount + 1;
        localStorage.setItem('pixscaler_image_count', newCount.toString());
        localStorage.setItem('pixscaler_stats', JSON.stringify({ count: newCount }));
        
        updateSocialProof();
        
        if (newCount === 10 || newCount === 50 || newCount === 100 || newCount % 500 === 0) {
            showAchievement('🎉', newCount + ' Images Processed!', 'You\'re becoming a pro!');
        }
    } catch (error) {
        console.warn('Failed to increment image counter:', error);
    }
}

function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        // Throttle scroll handler with requestAnimationFrame
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                const hero = document.querySelector('.hero');
                if (hero) {
                    const scrolled = window.pageYOffset;
                    hero.style.transform = 'translateY(' + (scrolled * -0.5) + 'px)';
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
}

function updateSocialProof() {
    try {
        const totalProcessed = loadImageCounter();
        
        if (totalProcessed > 0) {
            document.title = 'Pixscaler - ' + totalProcessed.toLocaleString() + ' Images Processed';
        }
    } catch (error) {
        console.warn('Failed to update social proof:', error);
    }
}

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

function copyAddress() {
    navigator.clipboard.writeText(SOLANA_ADDRESS).then(function() {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅';
        copyBtn.style.background = '#10b981';
        
        setTimeout(function() {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
        showDonationToast('Solana address copied! 🚀');
    }).catch(function() {
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
    const toast = document.createElement('div');
    toast.className = 'donation-toast';
    toast.innerHTML = message;
    
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; ' +
        'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); ' +
        'color: white; padding: 12px 20px; border-radius: 8px; ' +
        'box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; ' +
        'font-weight: 500; animation: slideIn 0.3s ease-out; ' +
        'max-width: 300px; word-wrap: break-word;';
    
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } ' +
            '@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(function() {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function shareProject() {
    const text = "Check out Pixscaler - a free, professional image resizer that works entirely in your browser!";
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Pixscaler - Professional Image Resizer',
            text: text,
            url: url
        }).catch(function() {
            fallbackShare(text, url);
        });
    } else {
        fallbackShare(text, url);
    }
}
