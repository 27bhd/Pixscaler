/**
 * Pixscaler Mobile - Client-Side Image Resizer
 * Built by Benchehida Abdelatif
 * https://www.linkedin.com/in/benchehida-abdelatif-97b377369/
 */
(function() {
    'use strict';

    // Get shared utilities
    var Utils = window.PixscalerUtils;
    var CONFIG = Utils.CONFIG;
    var isSupportedImageFile = Utils.isSupportedImageFile;
    var isHeicFile = Utils.isHeicFile;
    var convertHeicFile = Utils.convertHeicFile;
    var formatFileSize = Utils.formatFileSize;
    var isIOS = Utils.isIOS;
    var cleanupCanvas = Utils.cleanupCanvas;
    var loadImageFromFile = Utils.loadImageFromFile;

    // Donation address
    var SOLANA_ADDRESS = '5Ap6T93SRLFj9Urg7SWk1As5nNDunb6zEzyw8fpSUuHo';

    // Application state
    var selectedFiles = [];
    var processedImages = [];
    var isProcessing = false;
    var previewObjectUrl = null;

    document.addEventListener('DOMContentLoaded', function() {
        var fileInput = document.getElementById('fileInput');
        var uploadArea = document.getElementById('uploadArea');
        var uploadButton = document.getElementById('uploadButton');
        var qualitySlider = document.getElementById('quality');
        var qualityValue = document.getElementById('qualityValue');
        var solanaAddressEl = document.getElementById('solanaAddress');

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

        setupEventListeners();
    });

    function setupEventListeners() {
        document.querySelectorAll('.preset-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var text = this.textContent;
                var match = text.match(/(\d+)×(\d+)/);
                if (match) {
                    setPreset(parseInt(match[1]), parseInt(match[2]));
                }
            });
        });

        var processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.addEventListener('click', processImages);
        }

        var clearBtn = document.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearSelection);
        }

        var cancelBtn = document.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', cancelProcessing);
        }

        var newImageBtn = document.querySelector('.new-image-btn');
        if (newImageBtn) {
            newImageBtn.addEventListener('click', resetUpload);
        }

        var copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', copyAddress);
        }

        document.querySelectorAll('.amount-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var amount = parseFloat(this.textContent);
                showDonationMessage(amount);
            });
        });

        var shareBtn = document.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', shareApp);
        }

        var githubBtn = document.querySelector('.github-btn');
        if (githubBtn) {
            githubBtn.addEventListener('click', openGitHub);
        }

        var hireBtn = document.querySelector('.hire-btn');
        if (hireBtn) {
            hireBtn.addEventListener('click', openLinkedIn);
        }

        document.querySelectorAll('.nav-btn').forEach(function(btn) {
            var label = btn.querySelector('.nav-label');
            if (label) {
                var text = label.textContent.toLowerCase();
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

        document.querySelectorAll('.modal-close').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var modal = this.closest('.modal-overlay');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal-overlay')) {
                event.target.style.display = 'none';
            }
        });
    }

    function handleFileSelect(event) {
        var files = Array.from(event.target.files);
        if (files.length > 0) {
            var file = files[0];
            
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
        
        var files = Array.from(event.dataTransfer.files);
        
        if (files.length > 0) {
            var file = files[0];
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
        
        var imageInfo = document.getElementById('imageInfo');
        var fileCount = document.getElementById('fileCount');
        var totalSize = document.getElementById('totalSize');
        
        fileCount.textContent = '1 image selected';
        totalSize.textContent = formatFileSize(file.size);
        
        imageInfo.style.display = 'block';
    }

    function showSettings() {
        var settingsPanel = document.getElementById('settingsPanel');
        settingsPanel.style.display = 'block';
    }

    function prefillDimensions(file) {
        if (isHeicFile(file)) {
            document.getElementById('width').value = '';
            document.getElementById('height').value = '';
            return;
        }
        
        var url = URL.createObjectURL(file);
        var img = new Image();
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
        
        var presetBtns = document.querySelectorAll('.preset-btn');
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

    function processImages() {
        if (selectedFiles.length === 0 || isProcessing) {
            return;
        }
        
        var width = parseInt(document.getElementById('width').value);
        var height = parseInt(document.getElementById('height').value);
        var quality = parseInt(document.getElementById('quality').value) / 100;
        var format = document.querySelector('input[name="format"]:checked').value;
        
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
        
        var startTime = Date.now();
        var file = selectedFiles[0];
        
        updateProgress(0, 1, 'Processing ' + file.name + '...');
        
        processImage(file, width, height, quality, format)
            .then(function(processedImage) {
                processedImages.push(processedImage);
                
                if (isProcessing) {
                    var processingTimeMs = Date.now() - startTime;
                    updateProgress(1, 1, 'Processing complete');
                    showResults(processingTimeMs);
                }
            })
            .catch(function(error) {
                console.error('Processing error:', error);
                showToast('Error processing image. Please try again.');
            })
            .finally(function() {
                isProcessing = false;
                hideProgress();
            });
    }

    function processImage(file, width, height, quality, format) {
        var workingFilePromise = isHeicFile(file) 
            ? convertHeicFile(file) 
            : Promise.resolve(file);
        
        return workingFilePromise.then(function(workingFile) {
            return loadImageFromFile(workingFile).then(function(img) {
                return new Promise(function(resolve, reject) {
                    try {
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        var mimeType = 'image/' + format;
                        canvas.toBlob(function(blob) {
                            cleanupCanvas(canvas, ctx);
                            
                            if (!blob) {
                                reject(new Error('Failed to process image'));
                                return;
                            }
                            
                            var originalName = file.name.replace(/\.[^/.]+$/, '');
                            var extension = format === 'jpeg' ? 'jpg' : format;
                            var newName = originalName + '_' + width + 'x' + height + '.' + extension;
                            
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
            });
        });
    }

    function showProgress() {
        document.getElementById('settingsPanel').style.display = 'none';
        document.getElementById('progressSection').style.display = 'block';
    }

    function updateProgress(current, total, message) {
        var progressFill = document.getElementById('progressFill');
        var progressText = document.getElementById('progressText');
        
        var safeTotal = Math.max(total, 1);
        var percentage = Math.min(100, Math.round((current / safeTotal) * 100));
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

    function showResults() {
        var resultsSection = document.getElementById('resultsSection');
        var singleResult = document.getElementById('singleResult');
        
        resultsSection.style.display = 'block';
        singleResult.style.display = 'block';
        
        var previewImage = document.getElementById('previewImage');
        var downloadBtn = document.getElementById('downloadBtn');
        
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
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
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
                var file = new File([blob], filename, { type: blob.type });
                
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
            
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
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
        var textArea = document.createElement('textarea');
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
        var toast = document.createElement('div');
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
})();
