<h1> 🛡️ PhishGuard – AI-Powered Phishing Email Detection</h1>

PhishGuard is a web-based security tool that analyzes email content and predicts whether it is legitimate or phishing using AI-driven classification, user history tracking, and a smooth authentication experience. Built with modern web technologies and cloud-based backend services, PhishGuard helps users stay safe from deceptive email attacks.

<b><h2>🚀 Features</b></h2>

✅AI-based phishing detection <br>
✅Email text analysis & confidence scoring <br>
✅User authentication (Sign-in / Sign-up) <br>
✅Scan history tracking <br>
✅Clean and responsive UI <br>
✅Feedback widget for improvement <br>
✅Deployed live using Bolt / Supabase stack <br>

<b><h2>🧠 Technology Stack</b></h2>
<h3>Frontend</h3>

-React + TypeScript

-Tailwind CSS

-Vite

-Context API

<h3>Backend / Services</h3>

-Supabase (Auth + Database)

-Edge Functions

-Machine Learning classifier

<h3>Utilities</h3>

-Custom hooks

-Modular components

-Environment config support

<h2><b>📁 Project Structure (Simplified)</b></h2>

```txt
project/
│── index.html
│── package.json
│── vite.config.ts
│── tailwind.config.js
│── tsconfig.json
│
├── components/
│   ├── InfoSection.tsx
│   ├── PhishingCheckPage.tsx
│   ├── EmailAnalyzer.tsx
│   ├── AuthModal.tsx
│   ├── HistoryModal.tsx
│   ├── FeedbackWidget.tsx
│   └── Header.tsx
│
├── contexts/
│   └── AuthContext.tsx
│
├── lib/
│   ├── supabase.ts
│   └── ml-trainer.ts
│
└── supabase/
    └── functions/
```

<h2><b>🛠️ Setup & Installation</h2><b>
1️⃣ Clone the repository

  ```txt
git clone https://github.com/Rohit01030/PhishGuard
cd PhishGuard
```
2️⃣ Install dependencies

```txt
npm install
```
3️⃣ Configure Environment

Create a .env file based on .env.example:
```txt
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```
4️⃣ Run locally
```txt
npm run dev
```
<b><h2>🌐 Live Deployment</b></h2>

🔗 Website: https://phishguard.bolt.host/

<b><h2>🧪 How It Works</b></h2>

1. Sign in to PhishGuard

2. Paste email text into the checker

3. AI model analyzes email patterns

4. View phishing probability + explanation

5. Save history for future reference

<b><h2>🎯 Future Enhancements</b></h2>

✅ Browser plugin <br>
✅ Attachment scanning <br>
✅ URL reputation scoring <br>
✅ Organization dashboard <br>

<b><h2>🤝 Contributing</b></h2>

Pull requests are welcome!
For major updates, please open an issue first.

<b><h2>📄 License</b></h2>

MIT License

<b><h2>🙋 Author</b></h2>

Rohit Kumar
Cybersecurity & Web Development Enthusiast<br>
Open to internship opportunities (CyberSecurity, AI, Web)<br>
🔗 GitHub: https://github.com/Rohit01030

🔗 LinkedIn: https://www.linkedin.com/in/rohit-kumar-122bcmcthbu/
