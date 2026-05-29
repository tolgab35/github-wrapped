# 🎯 GitHub Wrapped

A beautiful, personalized year-in-review experience for your GitHub activity. Get insights into your coding journey with stunning visualizations, stats, and AI-generated highlights.

![GitHub Wrapped](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 📊 **Comprehensive Stats** - Total commits, pull requests, issues, and contributions over the last 12 months
- 📈 **Year-over-Year Growth** - See how your activity compares to the previous year (e.g. `+24% vs 2024`)
- 🔥 **Streaks & Best Day** - Your longest contribution streak and most active day of the week
- 🏅 **Achievement Badges** - Auto-awarded badges like _Elite Contributor_, _Daily Coder_, and language mastery
- 📈 **Commit Activity Timeline** - Monthly chart of your coding patterns throughout the year
- 🎨 **Top Languages** - Beautiful chart showing your most-used programming languages
- 🏆 **Top Repositories** - Showcase your most active projects
- 🤖 **AI-Powered Highlights** - Personalized highlight cards generated with Google Gemini (with cached results and a graceful fallback when the AI quota is exhausted)
- 📸 **Shareable Cards** - Export your wrapped as a PNG image, or share directly to X (Twitter), LinkedIn, or via link
- 🛡️ **Rate-Limit Aware** - Live GitHub API rate-limit banner so you always know your remaining quota
- 🎭 **Smooth Animations** - Engaging user experience with Framer Motion
- 🌐 **No Login Required** - Works with public GitHub data only

## 🚀 Demo

[Live Demo](https://github-wrapped-sepia.vercel.app/)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Chart.js** + **react-chartjs-2** - Data visualization
- **React Router** - Client-side routing
- **Lucide React** & **React Icons** - Icon libraries
- **modern-screenshot** - Export the dashboard as a PNG image

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **graphql-request** - GitHub GraphQL API queries
- **Google Generative AI** - AI-powered highlights (Gemini)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

- Node.js (v20.19+ — required by Vite 7)
- npm or yarn
- GitHub Personal Access Token
- Google Gemini API Key

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/tolgab35/github-wrapped.git
cd github-wrapped
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `backend` directory:
```env
GITHUB_TOKEN=your_github_personal_access_token
GEMINI_API_KEY=your_google_gemini_api_key
# Allowed CORS origin for the frontend (optional in local dev).
# Defaults to the production Vercel URL if unset.
FRONTEND_URL=http://localhost:5173
```

> **Note:** The backend listens on port `3001` (hardcoded in `server.js`).

Create a `.env` file in the `frontend` directory:
```env
# Base URL of the backend API. Defaults to http://localhost:3001 if unset.
VITE_API_URL=http://localhost:3001
```

To get your API keys:
- **GitHub Token**: Go to GitHub Settings → Developer Settings → Personal Access Tokens → Generate new token (classic)
  - Required scope: `read:user` (the app only reads public contribution data)
- **Gemini API**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🏃‍♂️ Running the Application

1. **Start the backend server**
```bash
cd backend
npm start
```
The server will run on `http://localhost:3001`

2. **Start the frontend development server**
```bash
cd frontend
npm run dev
```
The app will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
```
The production build will be in the `dist` folder.

### Backend
The backend is ready for deployment as-is. Make sure to set environment variables on your hosting platform.

## 🌐 Deployment

### Frontend (Vercel)
The project includes a `vercel.json` configuration (SPA rewrites) for easy deployment:
```bash
cd frontend
vercel deploy
```
Set the `VITE_API_URL` environment variable on the host to point at your deployed backend.

### Backend (Heroku, Railway, etc.)
Deploy the backend to your preferred Node.js hosting platform and set the `GITHUB_TOKEN`, `GEMINI_API_KEY`, and `FRONTEND_URL` (your deployed frontend URL, used for CORS) environment variables.

## 📸 Screenshots

![GitHub Wrapped Screenshot](screenshots/Screenshot.png)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Tolga B.**
- GitHub: [@tolgab35](https://github.com/tolgab35)

## 🙏 Acknowledgments

- GitHub API for providing comprehensive user data
- Google Gemini for AI-powered insights
- All the amazing open-source libraries used in this project

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

⭐ If you found this project helpful, please give it a star!
