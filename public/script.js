// Pixscaler - Client-Side Image Resizer
// Built by Beniverse

let currentImage = null;
let originalFileName = '';
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

    // File input change handler
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

    // Increment usage counter
    incrementImageCounter();

    // Check achievements
    checkAchievements(originalSize, newSize);

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
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                processImageFile(file);
            } else {
                showError('Please drop an image file (JPEG, PNG, WebP, GIF)');
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
        
        // Ctrl + O: Upload image
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            document.getElementById('fileInput').click();
            return;
        }
        
        // Ctrl + Enter: Resize image
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (currentImage) {
                resizeImage();
            }
            return;
        }
        
        // Ctrl + R: Reset (override browser refresh)
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (currentImage) {
                resetUpload();
            }
            return;
        }
        
        // Number keys 1-4: Quick presets
        if (!e.ctrlKey && !e.altKey && currentImage) {
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
    const helpPanel = document.getElementById('keyboardHelp');
    helpPanel.classList.toggle('show');
    
    // Auto-hide after 5 seconds
    if (helpPanel.classList.contains('show')) {
        setTimeout(() => {
            helpPanel.classList.remove('show');
        }, 5000);
    }
}

// Achievement System
function showAchievement(icon, text, detail) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = `
        <div>
            <span class="achievement-icon">${icon}</span>
            <span class="achievement-text">${text}</span>
            <div class="achievement-detail">${detail}</div>
        </div>
    `;
    
    document.body.appendChild(achievement);
    
    // Remove after 4 seconds
    setTimeout(() => {
        achievement.style.animation = 'achievementSlide 0.5s ease-in reverse';
        setTimeout(() => {
            if (achievement.parentNode) {
                achievement.parentNode.removeChild(achievement);
            }
        }, 500);
    }, 4000);
}

function checkAchievements(originalSize, newSize) {
    const reduction = originalSize - newSize;
    totalBandwidthSaved += reduction;
    saveBandwidthStats();
    
    // File size reduction achievements
    if (reduction > 0) {
        const reductionMB = (reduction / (1024 * 1024)).toFixed(1);
        showAchievement('💾', 'Bandwidth Saved!', `You saved ${reductionMB} MB of bandwidth`);
    }
    
    // Total bandwidth milestones
    const totalMB = (totalBandwidthSaved / (1024 * 1024)).toFixed(1);
    if (totalBandwidthSaved > 10 * 1024 * 1024 && totalBandwidthSaved - reduction <= 10 * 1024 * 1024) {
        showAchievement('🏆', 'Bandwidth Hero!', `You've saved over 10 MB total!`);
    } else if (totalBandwidthSaved > 100 * 1024 * 1024 && totalBandwidthSaved - reduction <= 100 * 1024 * 1024) {
        showAchievement('🚀', 'Compression Master!', `You've saved over 100 MB total!`);
    }
    
    // Usage milestones
    const imageCountElement = document.getElementById('imageCount');
    const imageCount = imageCountElement ? parseInt(imageCountElement.textContent) || 0 : 0;
    if (imageCount === 10) {
        showAchievement('🎯', 'Getting Started!', 'You\'ve processed 10 images today');
    } else if (imageCount === 50) {
        showAchievement('⚡', 'Power User!', 'You\'ve processed 50 images today');
    }
}

function loadBandwidthStats() {
    const saved = localStorage.getItem('pixscaler_bandwidth_saved');
    if (saved) {
        totalBandwidthSaved = parseInt(saved) || 0;
    }
}

function saveBandwidthStats() {
    localStorage.setItem('pixscaler_bandwidth_saved', totalBandwidthSaved.toString());
}

// Share functionality
function shareSuccess() {
    const shareText = "I just resized images for FREE at pixscaler.com - no sign-up, no limits, completely private! 🖼️✨";
    const shareUrl = "https://pixscaler.com";
    
    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: 'Pixscaler - Free Image Resizer',
            text: shareText,
            url: shareUrl
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(shareText, shareUrl);
        });
    } else {
        fallbackShare(shareText, shareUrl);
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
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('pixscaler_stats');
    let stats = { date: today, count: 0 };
    
    if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.date === today) {
            stats = parsed;
        }
    }
    
    const imageCountElement = document.getElementById('imageCount');
    if (imageCountElement) {
        imageCountElement.textContent = stats.count;
    }
}

function incrementImageCounter() {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('pixscaler_stats');
    let stats = { date: today, count: 0 };
    
    if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.date === today) {
            stats = parsed;
        }
    }
    
    stats.count++;
    localStorage.setItem('pixscaler_stats', JSON.stringify(stats));
    
    // Animate counter update
    const counterElement = document.getElementById('imageCount');
    if (counterElement) {
        counterElement.style.animation = 'countUp 0.5s ease-out';
        counterElement.textContent = stats.count;
        
        setTimeout(() => {
            counterElement.style.animation = '';
        }, 500);
    }
}

// Scroll effects
function setupScrollEffects() {
    const floatingBadge = document.getElementById('floatingBadge');
    let hasScrolled = false;
    
    // Only set up scroll listener if floating badge exists
    if (floatingBadge) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            // Show floating badge after scrolling 200px
            if (scrollY > 200 && !hasScrolled) {
                floatingBadge.style.display = 'block';
                hasScrolled = true;
            } else if (scrollY <= 200 && hasScrolled) {
                floatingBadge.style.display = 'none';
                hasScrolled = false;
            }
        });
    }
    
    // Update social proof with simulated activity
    updateSocialProof();
}

function updateSocialProof() {
    const totalElement = document.getElementById('totalProcessed');
    if (totalElement) {
        // Simulate daily activity (between 50-200 images)
        const baseCount = 50 + Math.floor(Math.random() * 150);
        const imageCountElement = document.getElementById('imageCount');
        const userCount = imageCountElement ? parseInt(imageCountElement.textContent) || 0 : 0;
        totalElement.textContent = baseCount + userCount;
    }
}

console.log('🚀 Pixscaler Client-Side Edition loaded successfully!');

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
    toast.textContent = message;
    
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