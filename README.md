# RED MACHINE - Indian Market Sentiment Analysis

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Platform-Web-orange.svg" alt="Platform">
</p>

<p align="center">
  <b>A powerful, real-time dashboard that analyzes and displays sentiment trends for the Indian stock market using advanced AI-powered news analysis.</b>
</p>

![Dashboard Preview](https://via.placeholder.com/800x400?text=RED+MACHINE+Dashboard+Preview)

## 🚀 Overview

RED MACHINE is a sophisticated sentiment analysis platform specifically designed for the Indian stock market. It leverages artificial intelligence to analyze news articles from major financial sources, extracting sentiment data to help traders and investors make more informed decisions.

The system processes thousands of news articles in real-time, categorizing them as bullish, bearish, or neutral, and provides an overall market sentiment score that can be used as a supplementary indicator for trading decisions.

## ✨ Key Features

### Core Features
- **Real-time Sentiment Analysis**: Live tracking of market sentiment from major Indian financial news sources
- **AI-Powered Processing**: Advanced natural language processing algorithms specifically trained on Indian financial news
- **Interactive Dashboard**: Beautiful, responsive design with intuitive charts and visualizations
- **Sentiment Trends**: 24-hour sentiment trend analysis with detailed Chart.js visualizations

### Advanced Analytics
- **Market Predictions**: AI-powered market direction predictions with confidence scores
- **Live News Feed**: Real-time sentiment feed from MoneyControl, Economic Times, Business Standard, Mint, and Business Today
- **Source Analysis**: Track sentiment by news source with detailed analytics
- **Sector-specific Sentiment**: Filter sentiment data by market sectors (Banking, IT, Pharma, etc.)

### User Experience
- **Auto-refresh**: Configurable automatic data refresh (5 seconds to 5 minutes)
- **Export Data**: Export sentiment data for further analysis in CSV or JSON formats
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Admin Panel**: Glossy glass-effect admin interface with parallax scrolling and animations

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: Chart.js for interactive data visualization
- **Animation**: Anime.js for smooth, performant animations
- **Effects**: Parallax.js for depth and immersion
- **Styling**: Modern CSS with Glass Morphism, CSS Grid, and Flexbox
- **Icons**: SVG icons with CSS animations
- **Backend**: Python for data collection and sentiment analysis
- **Database**: Supabase for real-time data storage
- **API Integration**: NewsAPI for collecting financial news

## 🔧 Quick Start

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/TUSHARXP-10/RED-MACHINE--SENTIMENTS-indian-market-.git
   cd RED-MACHINE--SENTIMENTS-indian-market-
   ```

2. Start the development server:
   ```bash
   # Using Python's built-in server
   python -m http.server 8080
   
   # Or with Node.js
   npx serve
   ```

3. Open your browser to `http://localhost:8080` to view the dashboard

### News Collection Setup
1. **Get your API keys**:
   - NewsAPI: https://newsapi.org (free account)
   - Supabase: https://supabase.com (create project)

2. **Configure environment**:
   ```bash
   # Edit .env file with your keys
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-anon-key
   NEWSAPI_KEY=your-newsapi-key
   ```

3. **Run the collector**:
   ```bash
   # From project root directory:
   python run_pipeline.py

   # Or on Windows:
   double-click run_collector.bat

   # Or on Mac/Linux:
   ./run_collector.sh
   ```

## 📊 Dashboard Overview

### Key Metrics Displayed
- **Overall Sentiment**: Current market sentiment score (-100 to +100)
- **Articles Analyzed**: Total news articles processed in the current period
- **Sentiment Distribution**: Percentage breakdown of bullish, bearish, and neutral sentiment
- **Market Prediction**: AI prediction (UP/DOWN) with confidence percentage
- **Trending Topics**: Most mentioned stocks and market themes

### Interactive Features
- **Sidebar Controls**: Toggle auto-refresh, adjust refresh intervals
- **Sentiment Filters**: Filter news by sentiment type
- **Source Filters**: Filter by news source
- **Sector Filters**: Filter by market sector
- **Data Export**: Export current sentiment data as JSON or CSV
- **Time Range Selection**: View sentiment data for different time periods

### Visualizations
- **Sentiment Gauge**: Circular gauge showing overall market sentiment
- **Trend Chart**: 24-hour sentiment trend line chart
- **Distribution Pie**: Sentiment distribution pie chart
- **Source Chart**: Bar chart of sentiment by news source
- **Sector Heatmap**: Heatmap showing sentiment across different market sectors

## ⚙️ Configuration

### Refresh Intervals
- 5 seconds (default)
- 15 seconds
- 1 minute
- 5 minutes

### News Sources
The dashboard tracks sentiment from:
- MoneyControl
- Economic Times
- Business Standard
- Mint
- Business Today
- LiveMint
- CNBC TV18

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🧩 Project Structure

```
RED-MACHINE--SENTIMENTS-indian-market-/
├── index.html          # Main dashboard HTML
├── admin.html          # Admin panel with glass effect and parallax
├── style.css           # Main CSS styles with dark/light mode
├── admin-style.css     # Admin panel styling with glass morphism
├── app.js              # Main JavaScript application
├── admin.js            # Admin panel JavaScript with animations
├── api.js              # API integration functions
├── market-status.js    # Market status tracking
├── config.js           # Configuration settings
├── scripts/            # Python scripts for data collection
│   ├── news_collector.py   # News collection script
│   └── test_setup.py       # Setup testing script
├── run_collector.bat   # Windows batch file for collector
├── run_collector.sh    # Unix shell script for collector
├── run_pipeline.py     # Main pipeline runner
├── requirements.txt    # Python dependencies
├── package.json        # NPM configuration
├── .env                # Environment variables (gitignored)
├── .gitignore          # Git ignore file
├── SETUP.md            # Setup instructions
├── DEPLOY.md           # Deployment guide
└── README.md           # This file
```

## 🔍 Development

### Adding New Features

1. **New Data Sources**: Modify the `data` object in `app.js`
2. **New Charts**: Add Chart.js configurations in the `initializeCharts()` method
3. **New Filters**: Extend the filtering logic in the event listeners
4. **New Animations**: Add Anime.js animations in the appropriate JavaScript files

### Styling Customization

The dashboard uses CSS custom properties (CSS variables) for easy theme customization. Key variables are defined in `:root` and can be modified in `style.css` and `admin-style.css`.

## ⚡ Performance

- **Lightweight Core**: Minimal dependencies for fast loading
- **Optimized Animations**: Efficient animations with hardware acceleration
- **Smooth Transitions**: CSS and JavaScript-based transitions
- **Efficient Updates**: Minimal DOM manipulation for real-time updates
- **Lazy Loading**: Resources loaded only when needed

## 📜 License

MIT License - feel free to use and modify for personal and educational purposes.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Contact for Full Version

This repository contains a limited version of the RED MACHINE sentiment analysis platform. For access to the full version with advanced features, please contact:

- **Email**: [contact@redmachine-ai.com](mailto:contact@redmachine-ai.com)
- **Website**: [www.redmachine-ai.com](https://www.redmachine-ai.com)
- **GitHub**: [TUSHARXP-10](https://github.com/TUSHARXP-10)

### Full Version Additional Features

- **Real-time API**: Direct API access to sentiment data
- **Custom Alerts**: Set up alerts for sentiment thresholds
- **Historical Data**: Access to historical sentiment data
- **Advanced Analytics**: Correlation analysis with market movements
- **Custom Dashboards**: Create personalized dashboard layouts
- **Mobile App**: Dedicated mobile application for iOS and Android
- **Integration**: Connect with trading platforms and other financial tools

## 🔗 Related Projects

- [Stock Market Prediction AI](https://github.com/TUSHARXP-10/stock-market-prediction)
- [Financial News Analyzer](https://github.com/TUSHARXP-10/financial-news-analyzer)

---

<p align="center">
  <b>RED MACHINE - Turning News into Actionable Trading Insights</b>
</p>