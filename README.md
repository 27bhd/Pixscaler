# 🖼️ Pixscaler - Professional Client-Side Image Resizer

<div align="center">

![Pixscaler Banner](https://img.shields.io/badge/Pixscaler-Professional%20Image%20Resizer-blue?style=for-the-badge&logo=image&logoColor=white)

**Transform your images with professional precision - 100% free, forever!**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Client-Side](https://img.shields.io/badge/Processing-Client--Side-green.svg)](https://github.com/27bhd/Pixscaler)
[![No Backend](https://img.shields.io/badge/Backend-None-red.svg)](https://github.com/27bhd/Pixscaler)
[![Privacy First](https://img.shields.io/badge/Privacy-First-blue.svg)](https://github.com/27bhd/Pixscaler)
[![Bulk Processing](https://img.shields.io/badge/Bulk-Processing-orange.svg)](https://github.com/27bhd/Pixscaler)

[📖 Documentation](#-documentation) • [💖 Support](#-support-the-project) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 What is Pixscaler?

Pixscaler is a **completely client-side image resizing tool** that processes your images locally in your browser. No uploads, no servers, no subscriptions - just pure image resizing magic powered by HTML5 Canvas API.

### 🆕 **NEW: Bulk Processing**
Process hundreds of images at once with intelligent batch processing, progress tracking, and ZIP download - all while maintaining complete privacy!

### 🔄 How It Works

```mermaid
graph LR
    A[📁 Select Images] --> B{Single or Bulk?}
    B -->|Single| C[🖥️ Instant Processing]
    B -->|Bulk| D[📦 Batch Processing]
    C --> E[🎛️ Adjust Settings]
    D --> F[📊 Progress Tracking]
    E --> G[⚡ Instant Resize]
    F --> H[⚡ Bulk Resize]
    G --> I[💾 Download Image]
    H --> J[📦 Download ZIP]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
    style F fill:#e8f5e8
    style G fill:#e8f5e8
    style H fill:#e8f5e8
    style I fill:#fce4ec
    style J fill:#fce4ec
```

## ✨ Features Overview

<table>
<tr>
<td width="50%">

### 🔒 **Privacy & Security**
- 🆓 **100% Free Forever** - No subscriptions, no paywalls
- 🔒 **Complete Privacy** - Images never leave your device
- 🚫 **No Registration** - Start using immediately
- 🛡️ **Zero Data Collection** - No tracking, no analytics
- 📦 **Bulk Processing** - Process 100+ images while maintaining privacy

</td>
<td width="50%">

### ⚡ **Performance & Quality**
- ⚡ **Lightning Fast** - No upload delays, instant processing
- 🎯 **High Quality** - Professional-grade Canvas API
- 📏 **Unlimited File Sizes** - Process images of any size
- 🎛️ **Quality Control** - Adjustable compression settings
- 📊 **Smart Progress Tracking** - Real-time bulk processing updates
- 📦 **ZIP Downloads** - Organized bulk output with smart naming

</td>
</tr>
<tr>
<td width="50%">

### 🌐 **Compatibility**
- 📱 **Works Everywhere** - Any modern browser, any device
- 🎨 **Multiple Formats** - JPEG, PNG, WebP support
- 🌍 **Works Offline** - Once loaded, no internet needed
- 📐 **Preset Dimensions** - Quick resize to common sizes

</td>
<td width="50%">

### 🚀 **Developer Friendly**
- 📦 **Static Deployment** - Deploy anywhere instantly
- 🔧 **Open Source** - MIT License, fully customizable
- 📊 **Zero Server Costs** - No backend infrastructure
- ♾️ **Unlimited Usage** - No rate limits or quotas

</td>
</tr>
</table>

## 🏗️ Architecture Overview

### Client-Side Processing Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant B as 🌐 Browser
    participant C as 🎨 Canvas API
    participant F as 💾 File System
    
    Note over U,F: 🔒 100% Client-Side Processing - Zero Server Communication
    
    U->>+B: 📁 Select & Upload Image
    activate B
    Note right of B: 🔍 File validation & preview
    
    B->>+C: 🖼️ Load image to Canvas
    activate C
    Note right of C: 📐 Parse dimensions & format
    
    C->>C: ⚙️ Apply Transformations
    Note right of C: 🎛️ Resize • Compress • Convert
    
    C->>-B: ✨ Generate Processed Image
    deactivate C
    Note right of B: 🎯 Optimized output ready
    
    B->>+F: 💾 Trigger Download
    activate F
    Note right of F: 📥 Save to user device
    
    F-->>-U: ✅ Download Complete
    deactivate F
    deactivate B
    
    Note over U,F: 🚀 Entire process happens locally in browser
    Note over U,F: 🛡️ Your images never leave your device
```

### Technology Stack

```mermaid
graph TD
    subgraph "🎯 Core Technologies"
        A[🌐 Frontend Layer]
        B[🎨 HTML5 Canvas API]
        C[⚡ JavaScript ES6+]
        D[💎 CSS3 Styling]
    end
    
    subgraph "🔧 Processing Engine"
        E[🖼️ Image Processing]
        F[📁 File Handling]
        G[🎛️ UI Controls]
        H[📱 Responsive Design]
    end
    
    subgraph "💾 Output Layer"
        I[📥 Local Download]
        J[🔒 Zero Server Storage]
        K[⚡ Instant Results]
    end
    
    A --> B
    A --> C
    A --> D
    
    B --> E
    C --> F
    C --> G
    D --> H
    
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J
    I --> K
    
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style C fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style D fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style E fill:#fff8e1,stroke:#ffa000,stroke-width:2px
    style F fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style G fill:#e0f2f1,stroke:#00796b,stroke-width:2px
    style H fill:#f1f8e9,stroke:#689f38,stroke-width:2px
    style I fill:#e8eaf6,stroke:#3f51b5,stroke-width:3px
    style J fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style K fill:#e0f7fa,stroke:#0097a7,stroke-width:2px
```

## 🚀 Quick Start

### 1. **Instant Use** (Recommended)
Open the `public/index.html` file in your browser and start resizing immediately!

### 2. **Local Development**
```bash
# Clone the repository
git clone https://github.com/27bhd/Pixscaler.git
cd Pixscaler

# Serve locally (choose one)
python -m http.server 8000        # Python
npx serve .                       # Node.js
php -S localhost:8000            # PHP
```

Open `http://localhost:8000` in your browser.

## 📦 Bulk Processing Features

### 🚀 **Intelligent Batch Processing**
Process hundreds of images simultaneously with smart memory management and progress tracking.

#### **Key Features:**
- **📊 Real-time Progress** - Live updates with estimated completion time
- **🎯 Smart Memory Management** - Processes images in chunks to prevent browser freeze
- **📦 ZIP Downloads** - All processed images packaged with smart naming
- **⚡ Cancellable Processing** - Stop processing anytime with Escape key
- **📈 Statistics Dashboard** - File count, size reduction, and processing stats

#### **Smart File Naming:**
```
Original: photo.jpg → Resized: photo_800x600.jpg
Original: image.png → Resized: image_1920x1080.png
```

#### **Bulk Processing Workflow:**
```mermaid
graph TD
    A[📁 Select Multiple Images] --> B[📊 Bulk Info Display]
    B --> C[🎛️ Configure Settings]
    C --> D[📦 Start Batch Processing]
    D --> E[📈 Progress Tracking]
    E --> F{Processing Complete?}
    F -->|No| G[⚡ Process Next Image]
    G --> E
    F -->|Yes| H[📦 Generate ZIP]
    H --> I[💾 Download ZIP Archive]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#fff8e1
    style F fill:#fce4ec
    style G fill:#e0f2f1
    style H fill:#f1f8e9
    style I fill:#e8eaf6
```

### 🎯 **When to Use Bulk Processing**
- **Web Development**: Optimize multiple images for websites
- **Content Creation**: Resize social media assets in batches
- **Photography**: Process photo collections efficiently
- **E-commerce**: Standardize product images
- **Digital Marketing**: Prepare campaign assets

## 🎛️ Usage Guide

### Single Image Processing

```mermaid
flowchart TD
    Start([🚀 Start]) --> Upload[📁 Upload Image]
    Upload --> Preview[👁️ Preview Original]
    Preview --> Settings[⚙️ Adjust Settings]
    
    Settings --> Width[📏 Set Width]
    Settings --> Height[📐 Set Height]
    Settings --> Quality[🎛️ Set Quality]
    Settings --> Format[🎨 Choose Format]
    
    Width --> Process[⚡ Process Image]
    Height --> Process
    Quality --> Process
    Format --> Process
    
    Process --> Download[💾 Download Result]
    Download --> End([✅ Complete])
    
    style Start fill:#e8f5e8
    style Process fill:#fff3e0
    style Download fill:#e3f2fd
    style End fill:#f3e5f5
```

### Supported Operations

| Operation | Description | Formats |
|-----------|-------------|---------|
| 📏 **Resize** | Change image dimensions | JPEG, PNG, WebP |
| 🗜️ **Compress** | Reduce file size | JPEG, WebP |
| 🔄 **Convert** | Change image format | JPEG ↔ PNG ↔ WebP |
| 📐 **Preset Sizes** | Quick common dimensions | All formats |

## 🌐 Browser Compatibility

<div align="center">

| Browser | Version | Status |
|---------|---------|--------|
| ![Chrome](https://img.shields.io/badge/Chrome-60+-brightgreen) | 60+ | ✅ Full Support |
| ![Firefox](https://img.shields.io/badge/Firefox-55+-brightgreen) | 55+ | ✅ Full Support |
| ![Safari](https://img.shields.io/badge/Safari-11+-brightgreen) | 11+ | ✅ Full Support |
| ![Edge](https://img.shields.io/badge/Edge-79+-brightgreen) | 79+ | ✅ Full Support |
| ![Mobile](https://img.shields.io/badge/Mobile-iOS%20%7C%20Android-brightgreen) | Modern | ✅ Full Support |

</div>

## 🚀 Deployment Options

### Deployment Architecture

```mermaid
graph TB
    subgraph "💻 Source"
        G[📁 Pixscaler Repository<br/>Static Files Only]
    end
    
    subgraph "🚀 Deployment Platforms"
        A[📦 Vercel<br/>⚡ Instant Deploy]
        B[🌐 Netlify<br/>🔄 Auto Build]
        C[📄 GitHub Pages<br/>🆓 Free Hosting]
        D[☁️ Cloudflare Pages<br/>🛡️ Edge Network]
        E[🪣 AWS S3 + CloudFront<br/>📊 Enterprise Scale]
        F[🔥 Firebase Hosting<br/>🎯 Google Cloud]
    end
    
    subgraph "🌍 Global Distribution"
        H[🌐 Worldwide CDN<br/>⚡ Lightning Fast]
        I[👥 End Users<br/>🔒 Private Processing]
    end
    
    G -->|git push| A
    G -->|git push| B
    G -->|git push| C
    G -->|git push| D
    G -->|deploy| E
    G -->|deploy| F
    
    A -->|serve| H
    B -->|serve| H
    C -->|serve| H
    D -->|serve| H
    E -->|serve| H
    F -->|serve| H
    
    H -->|deliver| I
    
    style G fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    style A fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style B fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style C fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style D fill:#fff8e1,stroke:#ffa000,stroke-width:2px
    style E fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style F fill:#e0f2f1,stroke:#00796b,stroke-width:2px
    style H fill:#e8eaf6,stroke:#3f51b5,stroke-width:3px
    style I fill:#e0f7fa,stroke:#0097a7,stroke-width:3px
```

### Quick Deploy Commands

<details>
<summary>🔧 <strong>Vercel (Recommended)</strong></summary>

```bash
npm install -g vercel
vercel --prod
```
</details>

<details>
<summary>🌐 <strong>Netlify</strong></summary>

```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```
</details>

<details>
<summary>📄 <strong>GitHub Pages</strong></summary>

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select source branch (main)
4. Your site will be live at `https://username.github.io/pixscaler`
</details>

## 📊 Performance Metrics

### Processing Performance

*Performance varies based on device capabilities and image complexity*

```mermaid
xychart-beta
    title "Estimated Processing Time by Image Size"
    x-axis ["1MP", "5MP", "10MP", "20MP", "50MP"]
    y-axis "Time (seconds)" 0 --> 10
    bar [0.5, 1.2, 2.1, 3.8, 8.5]
```

### Key Performance Indicators

| Metric | Value | Description |
|--------|-------|-------------|
| ⚡ **Processing Time** | Varies by device | Depends on image size and device performance |
| 📊 **File Size Support** | Browser dependent | Limited by available browser memory |
| 👥 **Concurrent Users** | N/A | Client-side only, no server |
| ⏱️ **Availability** | Offline capable | Works without internet once loaded |
| 🌍 **Compatibility** | Modern browsers | Chrome 60+, Firefox 55+, Safari 11+, Edge 79+ |

## 💖 Support the Project

<div align="center">

**Pixscaler is completely free with no ads or tracking.**  
*If this tool saves you time and sanity, consider supporting the developer:*

### ◎ Solana Donations

```
5Ap6T93SRLFj9Urg7SWk1As5nNDunb6zEzyw8fpSUuHo
```

</div>

| Amount | What It Buys | Impact |
|--------|--------------|--------|
| 0.01 SOL 🥤 | Soda money | Keeps the developer hydrated |
| 0.05 SOL ☕ | Coffee fuel | Powers late-night coding sessions |
| 0.1 SOL 🍕 | Pizza contribution | Fuels feature development |
| 0.25 SOL 🚀 | Major support | Enables significant improvements |

### 🌟 Other Ways to Support

<div align="center">

[![Star on GitHub](https://img.shields.io/badge/⭐-Star%20on%20GitHub-yellow?style=for-the-badge)](https://github.com/27bhd/Pixscaler)
[![Share on Twitter](https://img.shields.io/badge/🐦-Share%20on%20Twitter-blue?style=for-the-badge)](https://twitter.com/intent/tweet?text=Check%20out%20Pixscaler%20-%20Free%20client-side%20image%20resizer!)
[![Tell Friends](https://img.shields.io/badge/💬-Tell%20Friends-green?style=for-the-badge)](#)

</div>

## ⌨️ Keyboard Shortcuts

Pixscaler includes powerful keyboard shortcuts for efficient workflow:

### **🚀 Processing Shortcuts**
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + O` | Upload Images | Open file picker to select images |
| `Ctrl + Enter` | Process Images | Start processing selected images |
| `Ctrl + R` | Reset | Clear all images and reset interface |
| `Escape` | Cancel Processing | Stop bulk processing (during batch operations) |

### **🎯 Quick Presets**
| Key | Preset | Dimensions |
|-----|--------|------------|
| `1` | Full HD | 1920×1080 |
| `2` | HD | 1280×720 |
| `3` | Standard | 800×600 |
| `4` | Square | 400×400 |

### **ℹ️ Help & Navigation**
| Shortcut | Action | Description |
|----------|--------|-------------|
| `?` | Toggle Help | Show/hide keyboard shortcuts overlay |

> **💡 Pro Tip:** Press `?` anytime to see the keyboard shortcuts overlay with real-time help!

## 🔧 Development

### Project Structure

```
Pixscaler/
├── 📁 public/                 # Main application
│   ├── 📄 index.html         # Main HTML file
│   ├── 📜 script.js          # Core JavaScript
│   ├── 🎨 style.css          # Styling
│   ├── 📱 site.webmanifest   # PWA manifest
│   └── 🖼️ favicon files      # Icons
├── 📁 legacy/                # Archived server code
├── 📄 package.json          # Dependencies
├── 📄 Procfile              # Deployment config
└── 📖 README.md             # This file
```

### Development Workflow

```mermaid
flowchart TD
    A[📝 Initial Setup] --> B[🌿 Create Feature Branch]
    B --> C[💻 Develop Feature]
    C --> D[🧪 Test Feature]
    D --> E{✅ Tests Pass?}
    E -->|No| C
    E -->|Yes| F[📝 Commit Changes]
    F --> G[🚀 Push to Branch]
    G --> H[🔄 Create Pull Request]
    H --> I[👀 Code Review]
    I --> J{✅ Approved?}
    J -->|No| C
    J -->|Yes| K[🔀 Merge to Main]
    K --> L[🚀 Deploy to Production]
    
    style A fill:#e8f5e8,stroke:#4caf50,stroke-width:2px
    style D fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style E fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style J fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style L fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
```

### Contributing Guidelines

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💻 Make** your changes
4. **✅ Test** thoroughly
5. **📝 Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **🚀 Push** to the branch (`git push origin feature/amazing-feature`)
7. **🔄 Open** a Pull Request

## 📚 Documentation

### Code Structure

<details>
<summary>🔧 <strong>Main Files</strong></summary>

- `public/index.html` - Main application interface
- `public/script.js` - Image processing logic using Canvas API
- `public/style.css` - Application styling
- `public/site.webmanifest` - PWA configuration

</details>

<details>
<summary>🎛️ <strong>Key Features in Code</strong></summary>

- HTML5 Canvas API for image processing
- File drag & drop functionality
- Quality adjustment controls
- Format conversion (JPEG, PNG, WebP)
- Preset dimension buttons

</details>

## 🛡️ Security & Privacy

### Privacy-First Architecture

```mermaid
graph TB
    subgraph "🔒 Secure Client-Side Processing"
        A[👤 User<br/>Your Device]
        B[🌐 Browser<br/>Local Environment]
        C[🎨 Canvas API<br/>Image Processing]
        D[💾 File System<br/>Local Download]
    end
    
    subgraph "🚫 What We DON'T Do"
        E[🚫 No Server Upload<br/>Images stay local]
        F[🚫 No Analytics<br/>Zero tracking]
        G[🚫 No Database<br/>No data storage]
        H[🚫 No Accounts<br/>Anonymous usage]
    end
    
    A -->|📁 Select Image| B
    B -->|🖼️ Process| C
    C -->|✨ Transform| C
    C -->|📥 Output| D
    D -->|💾 Save| A
    
    B -.->|❌ Never| E
    B -.->|❌ Never| F
    B -.->|❌ Never| G
    B -.->|❌ Never| H
    
    style A fill:#e8f5e8,stroke:#4caf50,stroke-width:3px
    style B fill:#e3f2fd,stroke:#2196f3,stroke-width:3px
    style C fill:#fff3e0,stroke:#ff9800,stroke-width:3px
    style D fill:#f3e5f5,stroke:#9c27b0,stroke-width:3px
    style E fill:#ffebee,stroke:#f44336,stroke-width:2px,stroke-dasharray: 5 5
    style F fill:#ffebee,stroke:#f44336,stroke-width:2px,stroke-dasharray: 5 5
    style G fill:#ffebee,stroke:#f44336,stroke-width:2px,stroke-dasharray: 5 5
    style H fill:#ffebee,stroke:#f44336,stroke-width:2px,stroke-dasharray: 5 5
```

### Security Features

- ✅ **No Server Communication** - Images never leave your device
- ✅ **No Data Collection** - Zero tracking or analytics
- ✅ **No Account Required** - Anonymous usage
- ✅ **Open Source** - Transparent code
- ✅ **Client-Side Only** - No backend vulnerabilities

## 📈 Roadmap

### Current Version: v3.0 🆕
- ✅ Client-side image processing
- ✅ Multiple format support (JPEG, PNG, WebP)
- ✅ Quality controls and compression
- ✅ Preset dimensions with quick shortcuts
- ✅ Mobile responsive design
- ✅ **Bulk Processing** - Process 100+ images simultaneously
- ✅ **ZIP Downloads** - Smart batch output with organized naming
- ✅ **Progress Tracking** - Real-time processing updates
- ✅ **Keyboard Shortcuts** - Efficient workflow controls
- ✅ **Smart Memory Management** - Handles large batches without freezing

### Upcoming Features
- 🎨 **Advanced Filters** - Blur, sharpen, brightness, contrast
- 📐 **Custom Crop** - Precise cropping tools with aspect ratio lock
- 🖼️ **Image Optimization** - Smart compression algorithms
- 💾 **Offline Mode** - Full PWA capabilities
- 🌙 **Dark Mode** - Theme switching
- 📊 **Processing Analytics** - Detailed statistics and insights

## 📞 Contact & Support

<div align="center">

**Built with ❤️ by Beniverse and Djim00o**

[![GitHub](https://img.shields.io/badge/💼-GitHub-black?style=for-the-badge)](https://github.com/27bhd)
[![Repository](https://img.shields.io/badge/📁-Repository-blue?style=for-the-badge)](https://github.com/27bhd/Pixscaler)

</div>

## 📄 License

```
MIT License

Copyright (c) 2024 Beniverse and Djim00o

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Made with ❤️ and lots of ☕**

[![GitHub stars](https://img.shields.io/github/stars/27bhd/Pixscaler?style=social)](https://github.com/27bhd/Pixscaler)
[![GitHub forks](https://img.shields.io/github/forks/27bhd/Pixscaler?style=social)](https://github.com/27bhd/Pixscaler)
[![GitHub watchers](https://img.shields.io/github/watchers/27bhd/Pixscaler?style=social)](https://github.com/27bhd/Pixscaler)

*⭐ Star this repo if you find it useful!*

</div> 