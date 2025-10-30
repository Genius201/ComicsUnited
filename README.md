# 🎭 Comics United

## Professional Networking Platform for Comedians

A modern web application connecting comedians professionally with comprehensive venue databases, collaboration features, and networking tools.

## 🚀 Live Demo

**Production Site**: [https://comics-united-beta.netlify.app](https://comics-united-beta.netlify.app)

## ✨ Features

### 🏛️ Comprehensive Venue Database

- **31+ Premium Comedy Venues** across major markets
- **6 States Covered**: NY, CA, IL, TX, FL, PA
- **Major Cities**: NYC, LA, Chicago, Austin, Miami, Philadelphia
- **Detailed Open Mic Information**: Times, costs, signup requirements, contact details

### 🎤 Comedian Networking

- Professional comedian profiles with verification system
- Direct messaging between comedians
- Rating and review system
- Specialty and experience level filtering

### 🔍 Advanced Search & Filtering

- State/city hierarchical browsing
- Venue type filtering (Comedy Club, Bar, Theater, etc.)
- Open mic availability toggle
- Text search across venues and descriptions

### 🎨 Modern UI/UX

- Glass-morphism design with backdrop blur effects
- Responsive design for all devices
- Professional authentication system
- Smooth animations and transitions

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 7.1.12
- **Styling**: Modern CSS with glass-morphism effects
- **Backend**: JSON Server (development)
- **Deployment**: Netlify
- **Authentication**: Local storage based (expandable)

## 📁 Project Structure

```text
src/
├── App.jsx                 # Main application component
├── App.css                 # Global app styles
├── LandingPage.jsx         # Landing page with signup/signin
├── LandingPage.css         # Landing page styles
├── Auth.jsx                # Authentication component
├── Auth.css               # Authentication styles
├── VenueSearch.jsx        # Comprehensive venue search component
├── VenueSearch.css        # Venue search styles
├── FeedbackModal.jsx      # Beta feedback modal
└── services/
    └── api.js             # API service layer

public/
├── index.html             # HTML template
└── favicon.ico           # App favicon

dist/                      # Production build output
netlify.toml              # Netlify deployment configuration
package.json              # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Genius201/comicsUnited.git
   cd comicsUnited
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Start backend server** (in another terminal)

   ```bash
   npm run server
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON server backend
- `npm run client` - Start only the frontend (Vite dev server)

## 🌐 Deployment

### Netlify (Current)

The app is configured for automatic deployment on Netlify:

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment**: Production ready with SPA routing

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 🎯 Key Components

### VenueSearch.jsx

Comprehensive venue database with:

- State/city filtering
- Venue type selection
- Open mic details display
- Search functionality
- 31+ venues with detailed information

### Auth.jsx

Professional authentication system with:

- Sign up and sign in forms
- User profile creation
- Stage name and bio management
- Experience level selection

### LandingPage.jsx

Professional landing page featuring:

- Prominent call-to-action buttons
- Feature highlights
- Demo credentials display
- Modern glass-morphism design

## 📊 Venue Database Coverage

### New York

- Comedy Cellar, Gotham Comedy Club, Caroline's on Broadway, etc.

### California

- The Comedy Store, Laugh Factory, Punchline SF, etc.

### Illinois

- Second City, Zanies Comedy Club, etc.

### Texas

- Cap City Comedy Club, Addison Improv, etc.

### Florida

- Miami Improv, Orlando Improv, etc.

### Pennsylvania

- Helium Comedy Club, Punchline Philly, etc.

## 🔄 Future Enhancements

- [ ] Real-time messaging system
- [ ] Event calendar integration
- [ ] Video portfolio uploads
- [ ] Advanced matching algorithms
- [ ] Mobile app development
- [ ] Payment integration for bookings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

### Gene Shaffer

- Email: <geneshaffer44@gmail.com>
- Project: Comics United Beta

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for lightning-fast development
- Netlify for seamless deployment
- Comedy community for inspiration

---

### Comics United - Connecting Comedians Professionally  
