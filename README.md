# 🦅 IlEAGLE Scan

### Piercing through hidden threats with sharp, eagle-eyed security defense.

IlEAGLE Scan is a defensive cybersecurity web application that allows users to submit suspicious URLs, code snippets and text logs for static security analysis.

---

## Features

- Suspicious URL analysis
- Code snippet analysis
- Static threat detection
- SAFE / SUSPICIOUS / DANGEROUS verdicts
- Risk score
- Confidence rating
- X-Ray plain-English analysis
- Real-world impact analysis
- Security remediation guidance
- Active breach emergency guide
- Responsive desktop/mobile interface
- Fullscreen intro animation
- No login required
- No submitted code execution

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React

### Backend

- Node.js
- Express
- Helmet
- CORS

### Scanner

Custom JavaScript static-analysis heuristics.

---

# Project Structure

```text
IlEAGLE-Scan/

ilEAGLE-Scan/
│
├── .git/
├── README.md
├── package-lock.json
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   │
│   └── src/
│       └── scanner.js
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    │
    ├── src/
    │   ├── main.jsx
    │   ├── Analyzer.jsx
    │   └── styles.css
    │
    ├── public/
    │   └── assets/
    │       ├── eagle-logo.png
    │       ├── intro-desktop.mp4
    │       └── intro-mobile.mp4
    │
    └── dist/
        ├── index.html
        └── assets/
            ├── eagle-logo.png
            ├── intro-desktop.mp4
            └── intro-mobile.mp4
