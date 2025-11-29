/**
 * Pixscaler Mobile - Client-Side Image Resizer
 * Built by Benchehida Abdelatif
 * https://www.linkedin.com/in/benchehida-abdelatif-97b377369/
 */

// Use shared utilities
const { 
    CONFIG, 
    isSupportedImageFile, 
    isHeicFile, 
    convertHeicFile, 
    formatFileSize, 
    formatProcessingTime,
    generateFileName,
    isIOS,
    cleanupCanvas,
    loadImageFromFile
} = window.PixscalerUtils;

// Donation address
const SOLANA_ADDRESS = '5Ap6T93SRLFj9Urg7SWk1As5nNDunb6zEzyw8fpSUuHo';

// Application state
let selectedFiles = [];
let processedImages = [];
let isProcessing = false;
let previewObjectUrl = null;

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = document.getElementById('uploadButton');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const solanaAddressEl = document.getElementById('solanaAddress');

    if (solanaAddressEl) {
        solanaAddressEl.textContent = SOLANA_ADDRESS;
    }
    
    fileInput.addEventListener('change', handleFileSelect);
    
    uploadButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });
    
    uploadArea.addEventListener('click', function(e) {
        if (e.target !== uploadButton && !uploadButton.contains(e.target)) {
            fileInput.click();
        }
    });
    
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
    
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    // Set up event listeners for buttons
    setupEventListeners();
});

/**
 * Set up all button event listeners
 */
function setupEventListeners() {
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const text = this.textContent;
            const match = text.match(/(\d+)×(\d+)/);
            if (match) {
                setPreset(parseInt(match[1]), parseInt(match[2]));
            }
        });
    });

    // Process button
    const processBtn = document.getElementById('processBtn');
    if (processBtn) {
        processBtn.addEventListener('click', processImages);
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
    document.querySelectorAll('.amount-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const amount = parseFloat(this.textContent);
            showDonationMessage(amount);
        });
    });

    // Share button
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareApp);
    }

    // GitHub button
    const githubBtn = document.querySelector('.github-btn');
    if (githubBtn) {
        githubBtn.addEventListener('click', openGitHub);
    }

    // LinkedIn/Hire button
    const hireBtn = document.querySelector('.hire-btn');
    if (hireBtn) {
        hireBtn.addEventListener('click', openLinkedIn);
    }

    // Bottom nav buttons
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
        const label = btn.querySelector('.nav-label');
        if (label) {
            const text = label.textContent.toLowerCase();
            btn.addEventListener('click', function() {
                if (text === 'about') {
                    showAbout();
                } else if (text === 'desktop') {
                    showDesktopVersion();
                } else if (text === 'support') {
                    showSupport();
                }
            });
        }
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal when clicking overlay
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            event.target.style.display = 'none';
        }
    });
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        const file = files[0];
        
        if (isSupportedImageFile(file)) {
            selectedFiles = [file];
            showImageInfo(file);
            showSettings();
            prefillDimensions(file);
        } else {
            showToast('Please select a valid image file (JPEG, PNG, WebP, GIF, HEIC)');
        }
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files);
    
    if (files.length > 0) {
        const file = files[0];
        if (isSupportedImageFile(file)) {
            selectedFiles = [file];
            showImageInfo(file);
            showSettings();
            prefillDimensions(file);
        } else {
            showToast('Please select a valid image file');
        }
    }
}

function showImageInfo(file) {
    if (!file) file = selectedFiles[0];
    
    const imageInfo = document.getElementById('imageInfo');
    const fileCount = document.getElementById('fileCount');
    const totalSize = document.getElementById('totalSize');
    
    fileCount.textContent = '1 image selected';
    totalSize.textContent = formatFileSize(file.size);
    
    imageInfo.style.display = 'block';
}

function showSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    settingsPanel.style.display = 'block';
}

function prefillDimensions(file) {
    if (isHeicFile(file)) {
        document.getElementById('width').value = '';
        document.getElementById('height').value = '';
        return;
    }
    
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function() {
        document.getElementById('width').value = img.naturalWidth;
        document.getElementById('height').value = img.naturalHeight;
        URL.revokeObjectURL(url);
    };
    img.onerror = function() {
        URL.revokeObjectURL(url);
    };
    img.src = url;
}

function clearSelection() {
    selectedFiles = [];
    document.getElementById('fileInput').value = '';
    document.getElementById('imageInfo').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    hideResults();
    if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = null;
    }
}

function setPreset(width, height) {
    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
    
    // Visual feedback
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(function(btn) {
        if (btn.textContent === width + '×' + height) {
            btn.style.background = 'rgba(102, 126, 234, 0.3)';
            btn.style.borderColor = '#667eea';
            btn.style.color = '#fff';
            setTimeout(function() {
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 300);
        }
    });
}

async function processImages() {
    if (selectedFiles.length === 0 || isProcessing) {
        return;
    }
    
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const quality = parseInt(document.getElementById('quality').value) / 100;
    const format = document.querySelector('input[name="format"]:checked').value;
    
    if (!width || !height) {
        showToast('Please enter valid dimensions');
        return;
    }

    if (width > CONFIG.MAX_DIMENSION_PX || height > CONFIG.MAX_DIMENSION_PX) {
        showToast('Maximum dimensions are ' + CONFIG.MAX_DIMENSION_PX + 'x' + CONFIG.MAX_DIMENSION_PX + ' pixels');
        return;
    }
    
    isProcessing = true;
    showProgress();
    processedImages = [];
    
    const startTime = Date.now();
    
    try {
        const file = selectedFiles[0];
        
        updateProgress(0, 1, 'Processing ' + file.name + '...');
        
        const processedImage = await processImage(file, width, height, quality, format);
        processedImages.push(processedImage);
        
        if (isProcessing) {
            const processingTimeMs = Date.now() - startTime;
            updateProgress(1, 1, 'Processing complete');
            showResults(processingTimeMs);
        }
    } catch (error) {
        console.error('Processing error:', error);
        showToast('Error processing image. Please try again.');
    } finally {
        isProcessing = false;
        hideProgress();
    }
}

async function processImage(file, width, height, quality, format) {
    let workingFile = file;
    if (isHeicFile(file)) {
        workingFile = await convertHeicFile(file);
    }
    
    const img = await loadImageFromFile(workingFile);
    
    return new Promise(function(resolve, reject) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            const mimeType = 'image/' + format;
            canvas.toBlob(function(blob) {
                // Clean up canvas to free memory
                cleanupCanvas(canvas, ctx);
                
                if (!blob) {
                    reject(new Error('Failed to process image'));
                    return;
                }
                
                const originalName = file.name.replace(/\.[^/.]+$/, '');
                const extension = format === 'jpeg' ? 'jpg' : format;
                const newName = originalName + '_' + width + 'x' + height + '.' + extension;
                
                resolve({
                    blob: blob,
                    name: newName,
                    originalSize: file.size,
                    newSize: blob.size,
                    width: width,
                    height: height
                });
            }, mimeType, format === 'png' ? undefined : quality);
        } catch (error) {
            reject(error);
        }
    });
}

function showProgress() {
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('progressSection').style.display = 'block';
}

function updateProgress(current, total, message) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const safeTotal = Math.max(total, 1);
    const percentage = Math.min(100, Math.round((current / safeTotal) * 100));
    progressFill.style.width = percentage + '%';
    progressText.textContent = message || 'Processing image...';
}

function hideProgress() {
    document.getElementById('progressSection').style.display = 'none';
}

function cancelProcessing() {
    isProcessing = false;
    hideProgress();
    document.getElementById('settingsPanel').style.display = 'block';
    showToast('Processing cancelled.');
}

function showResults(processingTimeMs) {
    const resultsSection = document.getElementById('resultsSection');
    const singleResult = document.getElementById('singleResult');
    
    resultsSection.style.display = 'block';
    singleResult.style.display = 'block';
    
    const previewImage = document.getElementById('previewImage');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
    }
    previewObjectUrl = URL.createObjectURL(processedImages[0].blob);
    previewImage.src = previewObjectUrl;
    
    downloadBtn.onclick = function() {
        downloadFile(processedImages[0].blob, processedImages[0].name);
    };
}

function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

function downloadFile(blob, filename) {
    if (isIOS()) {
        downloadFileIOS(blob, filename);
    } else {
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

function downloadFileIOS(blob, filename) {
    try {
        if (navigator.share && navigator.canShare) {
            const file = new File([blob], filename, { type: blob.type });
            
            if (navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: filename,
                    text: 'Download ' + filename + ' from Pixscaler'
                }).then(function() {
                    showToast('✅ Choose "Save to Files" to download your image!');
                }).catch(function(error) {
                    if (error.name !== 'AbortError') {
                        showToast('Download ready! Check your Files app or try again.');
                    }
                });
                return;
            }
        }
        
        // Fallback for older iOS or unsupported browsers
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

function resetUpload() {
    clearSelection();
    hideResults();
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showAbout() {
    showModal('aboutModal');
}

function showDesktopVersion() {
    if (confirm('Switch to desktop version?')) {
        localStorage.setItem('forceDesktop', 'true');
        window.location.href = 'index.html';
    }
}

function showSupport() {
    showModal('supportModal');
}

function copyAddress() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(SOLANA_ADDRESS).then(function() {
            showToast('Address copied to clipboard!');
        }).catch(function() {
            fallbackCopy(SOLANA_ADDRESS);
        });
    } else {
        fallbackCopy(SOLANA_ADDRESS);
    }
}

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

function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'Pixscaler - Mobile Image Resizer',
            text: 'Check out this awesome image resizer tool!',
            url: window.location.href
        }).catch(function(err) {
            console.error('Share error:', err);
        });
    } else {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(function() {
                showToast('Link copied to clipboard!');
            });
        }
    }
}

function openGitHub() {
    window.open('https://github.com/27bhd/Pixscaler', '_blank');
}

function openLinkedIn() {
    window.open('https://www.linkedin.com/in/benchehida-abdelatif-97b377369/', '_blank');
}

function showDonationMessage(amount) {
    showToast('Please send ' + amount + ' SOL to the address above. Thank you for your support! 🙏');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); ' +
        'background: rgba(0, 0, 0, 0.9); color: white; padding: 1rem 1.5rem; border-radius: 8px; ' +
        'font-size: 0.9rem; z-index: 10000; max-width: 80%; text-align: center; ' +
        'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 3000);
}
