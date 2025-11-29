/**
 * Pixscaler - Shared Utilities
 * Common functions used across desktop and mobile versions
 */
(function() {
    'use strict';

    // Configuration constants
    var CONFIG = {
        MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024,  // 50MB
        MAX_DIMENSION_PX: 8000,
        LARGE_FILE_THRESHOLD_BYTES: 5 * 1024 * 1024,  // 5MB
        DEFAULT_QUALITY: 85,
        HEIC_CONVERSION_QUALITY: 0.9
    };

    // Supported file types
    var SUPPORTED_MIME_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/heic',
        'image/heif'
    ];

    var SUPPORTED_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.heic', '.heif'];
    var HEIC_MIME_TYPES = ['image/heic', 'image/heif'];

    /**
     * Check if a file is a supported image type
     */
    function isSupportedImageFile(file) {
        if (!file) return false;
        
        var type = (file.type || '').toLowerCase();
        if (SUPPORTED_MIME_TYPES.indexOf(type) !== -1) {
            return true;
        }
        
        // Fallback to extension check for files without proper MIME type
        var name = (file.name || '').toLowerCase();
        return SUPPORTED_EXTENSIONS.some(function(ext) {
            return name.endsWith(ext);
        });
    }

    /**
     * Check if a file is HEIC/HEIF format
     */
    function isHeicFile(file) {
        if (!file) return false;
        
        var type = (file.type || '').toLowerCase();
        if (HEIC_MIME_TYPES.indexOf(type) !== -1) {
            return true;
        }
        
        var name = (file.name || '').toLowerCase();
        return name.endsWith('.heic') || name.endsWith('.heif');
    }

    /**
     * Convert HEIC file to JPEG
     */
    function convertHeicFile(file) {
        return new Promise(function(resolve, reject) {
            if (typeof window.heic2any !== 'function') {
                reject(new Error('HEIC support not loaded. Please refresh the page.'));
                return;
            }
            
            window.heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: CONFIG.HEIC_CONVERSION_QUALITY
            }).then(function(convertedBlob) {
                var newName = replaceExtension(file.name, 'jpg');
                var newFile = new File([convertedBlob], newName, { 
                    type: 'image/jpeg', 
                    lastModified: Date.now() 
                });
                resolve(newFile);
            }).catch(reject);
        });
    }

    /**
     * Replace file extension
     */
    function replaceExtension(filename, newExtension) {
        return filename.replace(/\.[^/.]+$/, '') + '.' + newExtension;
    }

    /**
     * Format bytes to human readable size
     */
    function formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        
        var units = ['B', 'KB', 'MB', 'GB'];
        var k = 1024;
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        var size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
        
        return size + ' ' + units[i];
    }

    /**
     * Format milliseconds to human readable time
     */
    function formatProcessingTime(ms) {
        if (ms < 1000) {
            return ms + 'ms';
        } else if (ms < 60000) {
            return (ms / 1000).toFixed(1) + 's';
        } else {
            var minutes = Math.floor(ms / 60000);
            var seconds = Math.floor((ms % 60000) / 1000);
            return minutes + 'm ' + seconds + 's';
        }
    }

    /**
     * Format estimated time remaining
     */
    function formatTimeRemaining(ms) {
        if (ms < 1000) return 'Less than a second';
        
        var seconds = Math.floor(ms / 1000);
        if (seconds < 60) return seconds + ' seconds';
        
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return minutes + 'm ' + remainingSeconds + 's';
    }

    /**
     * Generate output filename with dimensions
     */
    function generateFileName(originalName, width, height, format) {
        var nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
        var extension = format === 'jpeg' ? 'jpg' : format;
        return nameWithoutExt + '_' + width + 'x' + height + '.' + extension;
    }

    /**
     * Detect iOS devices (works with modern browsers)
     */
    function isIOS() {
        // Check user agent for iOS devices
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            return true;
        }
        
        // Check for iPad on iOS 13+ (reports as Mac)
        if (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document) {
            return true;
        }
        
        return false;
    }

    /**
     * Yield to main thread to prevent UI blocking
     */
    function yieldToMainThread() {
        return new Promise(function(resolve) {
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(resolve);
            } else {
                setTimeout(resolve, 16);
            }
        });
    }

    /**
     * Clean up canvas to free memory
     */
    function cleanupCanvas(canvas, ctx) {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (canvas) {
            canvas.width = 1;
            canvas.height = 1;
        }
    }

    /**
     * Load image from file and return Image element
     */
    function loadImageFromFile(file) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            var objectUrl = URL.createObjectURL(file);
            
            img.onload = function() {
                URL.revokeObjectURL(objectUrl);
                resolve(img);
            };
            
            img.onerror = function() {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Failed to load image: ' + file.name));
            };
            
            img.src = objectUrl;
        });
    }

    // Export for use in other scripts
    window.PixscalerUtils = {
        CONFIG: CONFIG,
        SUPPORTED_MIME_TYPES: SUPPORTED_MIME_TYPES,
        SUPPORTED_EXTENSIONS: SUPPORTED_EXTENSIONS,
        HEIC_MIME_TYPES: HEIC_MIME_TYPES,
        isSupportedImageFile: isSupportedImageFile,
        isHeicFile: isHeicFile,
        convertHeicFile: convertHeicFile,
        replaceExtension: replaceExtension,
        formatFileSize: formatFileSize,
        formatProcessingTime: formatProcessingTime,
        formatTimeRemaining: formatTimeRemaining,
        generateFileName: generateFileName,
        isIOS: isIOS,
        yieldToMainThread: yieldToMainThread,
        cleanupCanvas: cleanupCanvas,
        loadImageFromFile: loadImageFromFile
    };
})();
