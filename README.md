# Pixscaler - Client-Side Image Resizer

🖼️ **Professional image resizing that runs entirely in your browser**

Built by [Beniverse](https://www.freelancer.com/u/Beniverse) | [LinkedIn](https://www.linkedin.com/in/beniverse/)

## ✨ Features

- 🚀 **Lightning Fast** - No upload delays, instant processing
- 🔒 **100% Private** - Images never leave your device
- 🎯 **High Quality** - Professional-grade Canvas API resizing
- 📱 **Cross-Platform** - Works on desktop, tablet, and mobile
- 💰 **Completely Free** - No registration, no limits, no costs
- 🌐 **Static Hosting** - Can be deployed anywhere (Vercel, Netlify, GitHub Pages)

## 🛠️ Technology Stack

- **HTML5 Canvas API** - For high-quality image processing
- **JavaScript ES6+** - Modern client-side functionality
- **CSS3** - Responsive and beautiful UI
- **Web APIs** - File handling and downloads
- **Client-Side Only** - No backend required

## 🚀 Quick Start

### Option 1: Static File Hosting

1. **Download/Clone** this repository
2. **Serve the files** using any static file server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Open** `http://localhost:8000` in your browser

### Option 2: Deploy to Static Hosting

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
1. Drag and drop the folder to [netlify.com/drop](https://netlify.com/drop)
2. Your site is live instantly!

#### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch

## 📁 File Structure

```
pixscaler/
├── index.html              # Main application page
├── public/
│   ├── style.css           # Styles and animations
│   ├── script.js           # Client-side image processing
│   ├── pricing.html        # Pricing page (optional)
│   └── site.webmanifest    # PWA manifest
├── README.md               # This file
└── server.js               # Legacy server (not needed for client-side)
```

## 🎯 How It Works

1. **File Selection** - User selects image via drag-drop or file picker
2. **Canvas Processing** - Image loaded into HTML5 Canvas element
3. **Resizing Algorithm** - High-quality resampling using Canvas API
4. **Format Conversion** - Output as JPEG, PNG, or WebP
5. **Download** - Processed image downloaded directly to user's device

## 🔧 Customization

### Adding New Presets
Edit the preset buttons in `index.html`:
```html
<button class="preset-btn" onclick="setPreset(1920, 1080)">1920×1080</button>
```

### Modifying Quality Settings
Adjust the quality slider range in `index.html`:
```html
<input type="range" id="quality" min="1" max="100" value="85">
```

### Changing Supported Formats
Update the format options in `index.html`:
```html
<input type="radio" id="jpeg" name="format" value="jpeg" checked>
<input type="radio" id="png" name="format" value="png">
<input type="radio" id="webp" name="format" value="webp">
```

## 🌟 Advantages Over Server-Based Solutions

| Feature | Client-Side | Server-Based |
|---------|-------------|--------------|
| **Privacy** | ✅ Images never uploaded | ❌ Images sent to server |
| **Speed** | ✅ Instant processing | ❌ Upload + processing time |
| **Cost** | ✅ Zero server costs | ❌ Server hosting required |
| **Scalability** | ✅ Unlimited users | ❌ Server capacity limits |
| **Offline** | ✅ Works without internet | ❌ Requires connection |
| **File Size** | ✅ No upload limits | ❌ Server-imposed limits |

## 🔒 Privacy & Security

- **No Data Collection** - Zero tracking or analytics
- **Local Processing** - Images processed entirely in browser
- **No Storage** - No images stored anywhere
- **HTTPS Ready** - Secure by default
- **No Cookies** - No tracking mechanisms

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance

- **File Size Limit**: Unlimited (browser memory dependent)
- **Processing Speed**: ~1-2 seconds for typical images
- **Memory Usage**: Efficient Canvas-based processing
- **Output Quality**: Lossless resizing with quality controls

## 🛠️ Development

### Local Development
```bash
# Clone repository
git clone https://github.com/27bhd/Pixscaler.git
cd Pixscaler

# Serve locally
python -m http.server 8000
# or
npx serve .

# Open browser
open http://localhost:8000
```

### Building for Production
No build step required! Just deploy the static files.

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 👨‍💻 About the Developer

Built by **Beniverse** - Full-Stack Developer specializing in modern web applications.

- 🌐 **Freelancer**: [freelancer.com/u/Beniverse](https://www.freelancer.com/u/Beniverse)
- 💼 **LinkedIn**: [linkedin.com/in/beniverse](https://www.linkedin.com/in/beniverse/)

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📞 Support

For questions or support, reach out via:
- Freelancer profile
- LinkedIn
- GitHub issues

---

**Pixscaler** - Professional image resizing, reimagined for the modern web. 🚀 