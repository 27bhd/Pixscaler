# 🖼️ Pixscaler - Professional Client-Side Image Resizer

<div align="center">

![Pixscaler Banner](https://img.shields.io/badge/Pixscaler-Professional%20Image%20Resizer-blue?style=for-the-badge&logo=image&logoColor=white)

**Transform your images with professional precision - 100% free, forever!**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Client-Side](https://img.shields.io/badge/Processing-Client--Side-green.svg)](https://github.com/27bhd/Pixscaler)
[![No Backend](https://img.shields.io/badge/Backend-None-red.svg)](https://github.com/27bhd/Pixscaler)
[![Privacy First](https://img.shields.io/badge/Privacy-First-blue.svg)](https://github.com/27bhd/Pixscaler)
[![Bulk Processing](https://img.shields.io/badge/Bulk-Processing-orange.svg)](https://github.com/27bhd/Pixscaler)

[🌐 Live Demo](https://pixscaler.com) • [💖 Support](#-support-the-project) • [🚀 Deploy](#-deployment)

</div>

---

## 🎯 What is Pixscaler?

Pixscaler is a **completely client-side image resizing tool** that processes your images locally in your browser. No uploads, no servers, no subscriptions - just pure image resizing magic powered by HTML5 Canvas API.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔒 **Complete Privacy** | Images never leave your device |
| ⚡ **Lightning Fast** | No upload delays, instant processing |
| 📦 **Bulk Processing** | Process 100+ images simultaneously |
| 🎯 **High Quality** | Professional-grade Canvas API output |
| 📱 **Cross-Platform** | Works on desktop, tablet, and mobile |
| 🆓 **100% Free** | No subscriptions, no paywalls |

## 🚀 Quick Start

### Option 1: Use Online
Visit [pixscaler.com](https://pixscaler.com) and start resizing immediately!

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/27bhd/Pixscaler.git
cd Pixscaler

# Serve locally (choose one)
npx serve public -p 3000       # Node.js
python -m http.server 3000     # Python
php -S localhost:3000          # PHP
```

Open `http://localhost:3000` in your browser.

## 🌐 Deployment

### Cloudflare Pages (Recommended)

Pixscaler is a static site - perfect for Cloudflare Pages!

1. **Connect Repository**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project" → "Connect to Git"
   - Select your Pixscaler repository

2. **Configure Build**
   | Setting | Value |
   |---------|-------|
   | Build command | _(leave empty)_ |
   | Build output directory | `public` |
   | Root directory | `/` |

3. **Deploy**
   - Click "Save and Deploy"
   - Your site will be live at `your-project.pages.dev`

4. **Custom Domain** (Optional)
   - Go to project settings → Custom domains
   - Add your domain and update DNS records

### Other Platforms

<details>
<summary>📦 Vercel</summary>

```bash
npm install -g vercel
vercel --prod
```
</details>

<details>
<summary>🌐 Netlify</summary>

```bash
npm install -g netlify-cli
netlify deploy --prod --dir public
```
</details>

<details>
<summary>📄 GitHub Pages</summary>

1. Go to Settings → Pages
2. Set source to `main` branch, `/public` folder
3. Save and wait for deployment
</details>

## 📁 Project Structure

```
Pixscaler/
├── public/                    # Static files (deploy this folder)
│   ├── index.html            # Desktop version
│   ├── mobile.html           # Mobile-optimized version
│   ├── script.js             # Desktop JavaScript
│   ├── mobile.js             # Mobile JavaScript
│   ├── style.css             # Desktop styles
│   ├── mobile.css            # Mobile styles
│   ├── site.webmanifest      # PWA manifest
│   └── android-chrome-192x192.png
├── .github/
│   └── FUNDING.yml           # GitHub sponsors
├── package.json              # Project metadata
└── README.md                 # This file
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + O` | Upload images |
| `Ctrl + Enter` | Process images |
| `Ctrl + R` | Reset |
| `Escape` | Cancel processing |
| `1-4` | Quick dimension presets |
| `?` | Toggle help |

## 🛡️ Privacy & Security

- ✅ **No Server Communication** - Images never leave your device
- ✅ **No Data Collection** - Zero tracking or analytics
- ✅ **No Account Required** - Anonymous usage
- ✅ **Open Source** - Transparent, auditable code
- ✅ **Client-Side Only** - No backend vulnerabilities

## 💖 Support the Project

If Pixscaler saves you time, consider supporting the developer!

### ◎ Solana Donations
```
5Ap6T93SRLFj9Urg7SWk1As5nNDunb6zEzyw8fpSUuHo
```

### 🌟 Other Ways to Support
- ⭐ Star this repository
- 📢 Share with friends and colleagues
- 🐛 Report bugs and suggest features
- 💼 [Connect on LinkedIn](https://www.linkedin.com/in/benchehida-abdelatif-97b377369/)

## 👨‍💻 Author

**Benchehida Abdelatif**

- 🔗 [LinkedIn](https://www.linkedin.com/in/benchehida-abdelatif-97b377369/)
- 💻 [GitHub](https://github.com/27bhd)

## 📄 License

```
MIT License

Copyright (c) 2025 Benchehida Abdelatif

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

**Made with ❤️ by Benchehida Abdelatif**

[![GitHub stars](https://img.shields.io/github/stars/27bhd/Pixscaler?style=social)](https://github.com/27bhd/Pixscaler)

*⭐ Star this repo if you find it useful!*

</div>
