# Portfolio Website

A modern, responsive portfolio website showcasing my work as a Software Engineer specializing in full-stack development.

## Features

- Responsive design that works on all devices
- Progressive Web App (PWA) support with offline functionality
- Smooth scroll animations
- Interactive testimonial carousel
- Latest articles section
- Contact form with Formspree integration
- Fast loading and optimized performance

## Technologies Used

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript
- Progressive Web App (Service Worker, Web App Manifest)

## Project Structure

```
class_portfolio/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # Main JavaScript functionality
├── manifest.json       # PWA manifest
├── Pwa/                # PWA related files
│   ├── service-worker.js
│   └── register-sw.js
├── icons/              # SVG icons
├── Images/             # Images and assets
│   ├── Articles/
│   └── avatars/
└── Docs/               # Documents
```

## Getting Started

1. Clone or download this repository
2. Open `index.html` in a web browser
3. For PWA features, serve via a local server:
   ```bash
   # Using Node.js
   npx serve
   ```

## PWA Setup

The portfolio includes Progressive Web App functionality:

1. Create PWA icons in the `icons/` folder:
   - `pwa-icon-192.png` (192x192px)
   - `pwa-icon-512.png` (512x512px)

2. The service worker will automatically register on page load

3. Test PWA features:
   - Open Chrome DevTools > Application > Service Workers
   - Test offline mode
   - Install the app using browser install prompt

## Customization

- Update personal information in `index.html`
- Modify colors in CSS custom properties (`:root` in `styles.css`)
- Add/remove portfolio projects, testimonials, or articles
- Update contact form endpoint in `script.js`


## Contact

Ocen Jude Otine
- Email: judextine28@gmail.com
- Website: https://judeotine.is-a.dev
- LinkedIn: https://linkedin.com/in/judeotine
- GitHub: https://github.com/judeotine

