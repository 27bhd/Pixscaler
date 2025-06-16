// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const controls = document.getElementById('controls');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const loading = document.getElementById('loading');
const downloadSection = document.getElementById('downloadSection');
const downloadBtn = document.getElementById('downloadBtn');
const previewSection = document.getElementById('preview');
const previewImage = document.getElementById('previewImage');

let selectedFile = null;
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check for OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        // Store the token and clean up URL
        localStorage.setItem('token', token);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    initializeApp();
    initializeAuth();
    checkAuthStatus();
});

function initializeApp() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // Quality slider
    if (qualitySlider) {
        qualitySlider.addEventListener('input', () => {
            if (qualityValue) {
                qualityValue.textContent = qualitySlider.value + '%';
            }
        });
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }
    
    selectedFile = file;
    showPreview(file);
}

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Set default dimensions
            widthInput.value = img.width;
            heightInput.value = img.height;
            
            // Show preview and controls
            if (previewImage) {
                previewImage.src = e.target.result;
                previewSection.style.display = 'block';
            }
            controls.style.display = 'block';
            downloadSection.style.display = 'none';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function setPreset(width, height) {
    widthInput.value = width;
    heightInput.value = height;
}

async function resizeImage() {
    if (!selectedFile) {
        alert('Please select an image first');
        return;
    }
    
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    const quality = parseInt(qualitySlider.value);
    const format = document.querySelector('input[name="format"]:checked').value;
    
    if (!width || !height || width <= 0 || height <= 0) {
        alert('Please enter valid dimensions');
        return;
    }
    
    // Show loading
    loading.style.display = 'block';
    controls.style.display = 'none';
    
    try {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('width', width);
        formData.append('height', height);
        formData.append('quality', quality);
        formData.append('format', format);
        
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch('/api/resize', {
            method: 'POST',
            body: formData,
            headers: headers
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Resize failed (${response.status})`);
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Show download
        downloadBtn.href = url;
        downloadBtn.download = `resized_${width}x${height}.${format}`;
        
        loading.style.display = 'none';
        downloadSection.style.display = 'block';
        
    } catch (error) {
        console.error('Image resize error:', error);
        const errorMessage = error.message.includes('Rate limit') 
            ? error.message 
            : error.message.includes('Invalid dimensions')
            ? error.message
            : error.message.includes('file size')
            ? error.message
            : 'Failed to resize image. Please try again.';
        alert(errorMessage);
        loading.style.display = 'none';
        controls.style.display = 'block';
    }
}

function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    controls.style.display = 'none';
    previewSection.style.display = 'none';
    downloadSection.style.display = 'none';
    loading.style.display = 'none';
}

// Auth Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchModal(fromModal, toModal) {
    closeModal(fromModal);
    document.getElementById(toModal).style.display = 'flex';
}

function initializeAuth() {
    // Auth form handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            updateAuthUI();
            closeModal('loginModal');
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = data.error || 'Login failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.style.display = 'block';
        }
    });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('registerError');
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            updateAuthUI();
            closeModal('registerModal');
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = data.error || 'Registration failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.style.display = 'block';
        }
    });
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    updateAuthUI();
}

function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.querySelector('.user-info');
    const userEmail = document.querySelector('.user-email');
    const premiumBadge = document.querySelector('.premium-badge');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userEmail.textContent = currentUser.email;
        
        if (currentUser.subscription && currentUser.subscription !== 'free') {
            premiumBadge.style.display = 'inline';
            premiumBadge.textContent = currentUser.subscription.toUpperCase();
        } else {
            premiumBadge.style.display = 'none';
        }
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateAuthUI();
        } else {
            localStorage.removeItem('token');
        }
    } catch (error) {
        localStorage.removeItem('token');
    }
}

function selectPlan(plan) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    // Redirect to payment or show upgrade modal
    alert(`Upgrading to ${plan} plan - Payment integration coming soon!`);
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Make functions globally accessible for onclick handlers
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.logout = logout;
window.setPreset = setPreset;
window.resizeImage = resizeImage;
window.resetUpload = resetUpload;
window.selectPlan = selectPlan;

// Performance optimization: Use passive event listeners where possible
document.addEventListener('scroll', () => {}, { passive: true });
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove', () => {}, { passive: true }); 