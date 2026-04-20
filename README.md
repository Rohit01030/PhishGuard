# Phish Guard 🛡️

<div align="center">

![Phish Guard Logo](https://img.shields.io/badge/Phish%20Guard-🛡️-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript)
![TensorFlow](https://img.shields.io/badge/TensorFlow.js-4.11.0-FF6F00?style=flat-square&logo=tensorflow)
![Supabase](https://img.shields.io/badge/Supabase-2.57.4-3ECF8E?style=flat-square&logo=supabase)

**A modern, AI-powered phishing email detection and analysis tool**

*Protect yourself from phishing attacks with advanced machine learning and real-time analysis*

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](https://github.com/your-repo/issues) • [✨ Request Feature](https://github.com/your-repo/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [📜 Available Scripts](#-available-scripts)
- [🏗️ Project Structure](#️-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🔒 Security](#-security)
- [📞 Support](#-support)

---

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🎯 **Advanced AI Analysis** | Uses machine learning models to detect phishing attempts with high accuracy |
| ⚡ **Real-time Risk Scoring** | Get instant risk assessments for suspicious emails |
| 🔐 **User Authentication** | Secure user accounts with Supabase authentication |
| 📊 **Analysis History** | Keep track of your email analysis history |
| 📱 **Responsive Design** | Works seamlessly on desktop and mobile devices |
| 💬 **Feedback System** | Help improve the model by providing feedback on analyses |

</div>

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React 18** - Modern React with hooks and concurrent features
- 📘 **TypeScript** - Type-safe JavaScript for better development experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- 🎯 **Lucide React** - Beautiful & consistent icon library

### Backend & Database
- 🗄️ **Supabase** - Open source Firebase alternative
  - Authentication
  - Real-time database
  - Edge functions
- 🔧 **Supabase Edge Functions** - Serverless functions for email analysis

### AI & ML
- 🤖 **TensorFlow.js** - Machine learning in JavaScript
- 📈 **Custom ML Models** - Trained models for phishing detection

### Development Tools
- ⚡ **Vite** - Fast build tool and development server
- 🔍 **ESLint** - Code linting and formatting
- 📦 **PostCSS** - CSS processing and optimization

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- 🟢 **Node.js** (version 18 or higher)
- 📦 **npm** or **yarn** package manager
- ☁️ **Supabase account** (for backend services)

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: 8.x.x or higher
```

---

## 🚀 Installation

Follow these steps to get Phish Guard running locally:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/phish-guard.git
cd phish-guard
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up Supabase
1. Create a new project on [Supabase](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Database Migrations
Navigate to your Supabase dashboard and run these migrations in order:

```sql
-- Run in Supabase SQL Editor
-- 1. supabase/migrations/20251115150648_create_email_analysis_schema.sql
-- 2. supabase/migrations/20251116070639_create_ml_training_tables.sql
-- 3. supabase/migrations/20251118061236_fix_security_issues.sql
```

---

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
# or
yarn build
yarn preview
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start the development server |
| `npm run build` | 🏗️ Build the project for production |
| `npm run preview` | 👀 Preview the production build locally |
| `npm run lint` | 🔍 Run ESLint for code quality checks |
| `npm run typecheck` | ✅ Run TypeScript type checking |

---

## 🏗️ Project Structure

```
phish-guard/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 components/         # React components
│   │   ├── AuthModal.tsx     # User authentication modal
│   │   ├── EmailAnalyzer.tsx # Main email analysis component
│   │   ├── FeedbackWidget.tsx # User feedback collection
│   │   ├── Header.tsx        # Application header
│   │   ├── HistoryModal.tsx  # Analysis history display
│   │   ├── InfoSection.tsx   # Information display section
│   │   └── PhishingCheckPage.tsx # Main phishing check page
│   ├── 📁 contexts/          # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   ├── 📁 lib/               # Utility libraries
│   │   ├── ml-trainer.ts     # ML model training utilities
│   │   └── supabase.ts       # Supabase client configuration
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── 📁 supabase/
│   ├── 📁 functions/         # Edge functions
│   │   └── 📁 analyze-email/ # Email analysis function
│   └── 📁 migrations/        # Database schema migrations
├── 📄 package.json           # Project dependencies
├── 📄 vite.config.ts         # Vite configuration
├── 📄 tailwind.config.js     # Tailwind CSS configuration
├── 📄 tsconfig.json          # TypeScript configuration
└── 📄 README.md              # Project documentation
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow
1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feature/amazing-feature`
3. 💻 Make your changes and commit: `git commit -m 'Add some amazing feature'`
4. 🚀 Push to the branch: `git push origin feature/amazing-feature`
5. 📝 Open a Pull Request

### Guidelines
- 📏 Follow the existing code style
- 🧪 Write tests for new features
- 📚 Update documentation as needed
- 🔄 Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```text
MIT License - feel free to use this project for personal and commercial purposes.
```

---

## 🔒 Security

Phish Guard takes security seriously:

- 🔐 **Client-side Processing**: Email content is analyzed locally when possible
- 🛡️ **Encrypted Data**: All sensitive data is encrypted in transit and at rest
- 🔒 **Secure Authentication**: Uses Supabase's secure authentication system
- 📊 **Privacy First**: No email content is stored without user consent

---

## 📞 Support

<div align="center">

**Need help? We're here for you!**

🐛 **Bug Reports**: [Open an Issue](https://github.com/your-repo/issues)  
💡 **Feature Requests**: [Create a Discussion](https://github.com/your-repo/discussions)  
📧 **Email Support**: support@phishguard.com  
💬 **Community**: [Join our Discord](https://discord.gg/phishguard)

</div>

---

<div align="center">

**Made with ❤️ by the Phish Guard Team**

⭐ **Star us on GitHub** if you find this project helpful!

[⬆️ Back to Top](#phish-guard-)

</div>

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

Phish Guard takes security seriously. All email content is processed locally on the client-side when possible, and sensitive data is encrypted in transit and at rest.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the maintainers.
