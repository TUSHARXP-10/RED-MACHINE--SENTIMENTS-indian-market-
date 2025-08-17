// Stock Market Sentiment AI Dashboard - JavaScript (Market-Aware Version)
class SentimentDashboard {
    constructor() {
        // Initialize market status
        this.marketStatus = new MarketStatus();
        
        this.data = {
            marketData: {
                overallSentiment: 0,
                totalArticlesToday: 0,
                bullishPercentage: 0,
                bearishPercentage: 0,
                neutralPercentage: 0,
                predictionConfidence: 0,
                prediction: "UP",
                lastUpdated: new Date().toISOString()
            },
            sentimentFeed: [],
            sentimentTrend: {
                timestamps: [],
                values: []
            },
            sources: [],
            recentAnalysis: []
        };
        
        // Load real data based on market status
        this.loadRealData();
        
        this.charts = {};
        this.autoRefreshInterval = null;
        this.isAutoRefreshEnabled = true;
        this.refreshIntervalTime = 5000; // 5 seconds
        this.newsTemplates = [
            "SENSEX {action} {points} points on {reason}",
            "Nifty {sector} index {action} {percentage}% on {reason}",
            "{company} stocks {action} amid {reason}",
            "FII {action} {amount} crore in {month}",
            "{sector} sector shows {sentiment} trends on {reason}"
        ];
        
        this.init();
    }

    updateMarketStatusDisplay() {
        const status = this.marketStatus.getMarketStatus();
        
        // Update the header status
        const statusElement = document.querySelector('.market-status-display');
        if (statusElement) {
            statusElement.innerHTML = `
                <div class="market-status-badge ${status.status.toLowerCase()}">
                    ${status.message}
                </div>
                <div class="market-status-description">
                    ${status.description}
                </div>
                ${!status.showLiveData ? `
                    <div class="next-market-open">
                        Next market open: ${this.marketStatus.getTimeUntilMarketOpen()}
                    </div>
                ` : ''}
            `;
        }

        // Update data context labels
        const contextElements = document.querySelectorAll('.data-context-label');
        contextElements.forEach(el => {
            el.textContent = status.dataContext;
        });

        // Update auto-refresh indicator
        const refreshIndicator = document.querySelector('#auto-refresh-indicator');
        if (refreshIndicator) {
            if (status.showLiveData) {
                refreshIndicator.style.display = 'flex';
                refreshIndicator.innerHTML = `
                    <span class="refresh-icon">↻</span>
                    Auto-refresh ON (30s)
                `;
            } else {
                refreshIndicator.innerHTML = `
                    <span class="refresh-icon">⏸</span>
                    Auto-refresh OFF (Market Closed)
                `;
            }
        }
    }

    async init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.initializeCharts();
        this.updateMarketStatusDisplay();
        await this.loadRealData();
        this.renderInitialData();
        this.setupRefreshStrategy();
        this.hideLoading();
        this.setupAdminZipButton();
        
        // Update date/time every second
        setInterval(() => this.updateDateTime(), 1000);
    }

    setupEventListeners() {
        // Sidebar controls - Fixed event listeners
        const sidebarTrigger = document.getElementById('sidebar-trigger');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebarTrigger && sidebar) {
            sidebarTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Opening sidebar'); // Debug log
                sidebar.classList.add('active');
            });
        }
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Closing sidebar'); // Debug log
                sidebar.classList.remove('active');
            });
        }
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !sidebarTrigger.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
        
        // Control buttons
        const manualRefreshBtn = document.getElementById('manual-refresh');
        if (manualRefreshBtn) {
            manualRefreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Manual refresh triggered'); // Debug log
                this.refreshData();
            });
        }
        
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                console.log('Auto refresh toggle:', e.target.checked); // Debug log
                this.toggleAutoRefresh(e.target.checked);
            });
        }
        
        const refreshInterval = document.getElementById('refresh-interval');
        if (refreshInterval) {
            refreshInterval.addEventListener('change', (e) => {
                console.log('Refresh interval changed:', e.target.value); // Debug log
                this.updateRefreshInterval(parseInt(e.target.value));
            });
        }
        
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Export data triggered'); // Debug log
                this.exportData();
            });
        }
        
        // Table filters - Fixed event listeners
        const sentimentFilter = document.getElementById('sentiment-filter');
        if (sentimentFilter) {
            sentimentFilter.addEventListener('change', (e) => {
                console.log('Sentiment filter changed:', e.target.value); // Debug log
                this.filterAnalysisTable();
            });
        }
        
        const sourceFilter = document.getElementById('source-filter');
        if (sourceFilter) {
            sourceFilter.addEventListener('change', (e) => {
                console.log('Source filter changed:', e.target.value); // Debug log
                this.filterAnalysisTable();
            });
        }
    }

    updateDateTime() {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
        };
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            timeZone: 'Asia/Kolkata'
        };
        
        const currentDate = document.getElementById('current-date');
        const currentTime = document.getElementById('current-time');
        const lastUpdated = document.getElementById('last-updated');
        
        if (currentDate) {
            currentDate.textContent = now.toLocaleDateString('en-IN', dateOptions);
        }
        if (currentTime) {
            currentTime.textContent = now.toLocaleTimeString('en-IN', timeOptions) + ' IST';
        }
        
        // Update last updated timestamp
        if (lastUpdated) {
            const lastUpdatedTime = new Date(this.data.marketData.lastUpdated);
            lastUpdated.textContent = `Last updated: ${lastUpdatedTime.toLocaleTimeString('en-IN', timeOptions)}`;
        }
    }

    setupAdminZipButton() {
        const zipButton = document.getElementById('admin-zip-button');
        if (zipButton) {
            zipButton.addEventListener('click', () => {
                // Add zipping class to trigger animation
                zipButton.classList.add('zipping');
                
                // Create transition element
                const transition = document.createElement('div');
                transition.classList.add('page-transition');
                document.body.appendChild(transition);
                
                // Navigate to admin page after animation completes
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 800);
            });
        }
    }

    initializeCharts() {
        this.createSentimentGauge();
        this.createSentimentTrendChart();
        this.createSentimentPieChart();
        this.createPredictionGauge();
    }

    createSentimentGauge() {
        const ctx = document.getElementById('sentiment-gauge').getContext('2d');
        const value = this.data.marketData.overallSentiment;
        
        this.charts.sentimentGauge = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [Math.max(0, value), Math.max(0, -value), 100 - Math.abs(value)],
                    backgroundColor: ['#1FB8CD', '#B4413C', '#ECEBD5'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                rotation: 180,
                circumference: 180,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    createSentimentTrendChart() {
        const ctx = document.getElementById('sentiment-trend-chart').getContext('2d');
        
        this.charts.sentimentTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.sentimentTrend.timestamps,
                datasets: [{
                    label: 'Sentiment Score',
                    data: this.data.sentimentTrend.values,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    createSentimentPieChart() {
        const ctx = document.getElementById('sentiment-pie-chart').getContext('2d');
        
        this.charts.sentimentPie = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Bullish', 'Bearish', 'Neutral'],
                datasets: [{
                    data: [
                        this.data.marketData.bullishPercentage,
                        this.data.marketData.bearishPercentage,
                        this.data.marketData.neutralPercentage
                    ],
                    backgroundColor: ['#1FB8CD', '#B4413C', '#ECEBD5'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 20, usePointStyle: true }
                    }
                }
            }
        });
    }

    createPredictionGauge() {
        const ctx = document.getElementById('prediction-gauge').getContext('2d');
        const confidence = this.data.marketData.predictionConfidence;
        
        this.charts.predictionGauge = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [confidence, 100 - confidence],
                    backgroundColor: ['#1FB8CD', '#ECEBD5'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: false,
                cutout: '75%',
                rotation: 270,
                circumference: 180,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    renderInitialData() {
        this.updateMetrics();
        this.renderSentimentFeed();
        this.renderSourcesList();
        this.renderAnalysisTable();
    }

    updateMetrics() {
        const sentimentValue = document.getElementById('sentiment-value');
        if (sentimentValue) {
            const sentiment = this.data.marketData.overallSentiment || 0;
            sentimentValue.textContent = 
                (sentiment > 0 ? '+' : '') + sentiment.toFixed(1);
        }
        
        const articlesCount = document.getElementById('articles-count');
        if (articlesCount) {
            articlesCount.textContent = this.data.marketData.totalArticlesToday;
        }
        
        const bullishPercentage = document.getElementById('bullish-percentage');
        if (bullishPercentage) {
            bullishPercentage.textContent = this.data.marketData.bullishPercentage + '%';
        }
        
        const bearishPercentage = document.getElementById('bearish-percentage');
        if (bearishPercentage) {
            bearishPercentage.textContent = this.data.marketData.bearishPercentage + '%';
        }
        
        const predictionEl = document.getElementById('prediction-direction');
        if (predictionEl) {
            predictionEl.textContent = this.data.marketData.prediction;
            predictionEl.className = 'prediction-direction ' + 
                (this.data.marketData.prediction === 'UP' ? 'metric-value--positive' : 'metric-value--negative');
        }
        
        const predictionConfidence = document.getElementById('prediction-confidence');
        if (predictionConfidence) {
            predictionConfidence.textContent = this.data.marketData.predictionConfidence + '%';
        }
    }

    renderSentimentFeed() {
        const feedContainer = document.getElementById('sentiment-feed');
        const feedCount = document.getElementById('feed-count');
        
        if (!feedContainer) return;
        
        feedContainer.innerHTML = '';
        if (feedCount) {
            feedCount.textContent = `${this.data.sentimentFeed.length} items`;
        }
        
        this.data.sentimentFeed.forEach(item => {
            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item';
            
            const timestamp = new Date(item.timestamp);
            const timeStr = timestamp.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: 'Asia/Kolkata'
            });
            
            feedItem.innerHTML = `
                <div class="feed-item__header">
                    <div class="feed-item__meta">
                        <span>${item.source}</span>
                        <span>•</span>
                        <span>${timeStr}</span>
                    </div>
                    <span class="sentiment-badge sentiment-badge--${item.sentiment}">
                        ${item.sentiment}
                    </span>
                </div>
                <h4 class="feed-item__headline">${item.headline}</h4>
            `;
            
            feedContainer.appendChild(feedItem);
        });
    }

    renderSourcesList() {
        const sourcesContainer = document.getElementById('sources-list');
        if (!sourcesContainer) return;
        
        sourcesContainer.innerHTML = '';
        
        this.data.sources.forEach(source => {
            const sourceItem = document.createElement('div');
            sourceItem.className = 'source-item';
            sourceItem.innerHTML = `
                <span class="source-name">${source.name}</span>
                <span class="source-count">${source.count}</span>
            `;
            sourcesContainer.appendChild(sourceItem);
        });
    }

    renderAnalysisTable() {
        const tbody = document.getElementById('analysis-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        let dataToShow = [...this.data.recentAnalysis];
        
        // Apply filters - Fixed filtering logic
        const sentimentFilter = document.getElementById('sentiment-filter');
        const sourceFilter = document.getElementById('source-filter');
        
        if (sentimentFilter && sentimentFilter.value !== 'all') {
            dataToShow = dataToShow.filter(item => 
                item.sentiment.toLowerCase() === sentimentFilter.value
            );
        }
        
        if (sourceFilter && sourceFilter.value !== 'all') {
            dataToShow = dataToShow.filter(item => item.source === sourceFilter.value);
        }
        
        dataToShow.forEach(item => {
            const row = document.createElement('tr');
            const scoreColor = item.score > 0 ? 'color: var(--color-success)' : 
                             item.score < 0 ? 'color: var(--color-error)' : 
                             'color: var(--color-info)';
            
            row.innerHTML = `
                <td class="time-cell">${item.time}</td>
                <td class="headline-cell" title="${item.headline}">${item.headline}</td>
                <td>${item.source}</td>
                <td>
                    <span class="sentiment-badge sentiment-badge--${item.sentiment.toLowerCase()}">
                        ${item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                    </span>
                </td>
                <td class="score-cell" style="${scoreColor}">
                    ${item.score > 0 ? '+' : ''}${(item.score || 0).toFixed(2)}
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Show message if no data matches filters
        if (dataToShow.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" style="text-align: center; padding: var(--space-20); color: var(--color-text-secondary);">
                    No data matches the selected filters
                </td>
            `;
            tbody.appendChild(row);
        }
    }

    filterAnalysisTable() {
        console.log('Filtering analysis table'); // Debug log
        this.renderAnalysisTable();
    }

    generateRandomNews() {
        const actions = ['gains', 'rallies', 'surges', 'declines', 'drops', 'falls'];
        const sectors = ['IT', 'Banking', 'Auto', 'Pharma', 'FMCG', 'Energy'];
        const companies = ['TCS', 'Infosys', 'HDFC Bank', 'Reliance', 'ICICI Bank', 'SBI'];
        const reasons = ['strong earnings', 'global optimism', 'policy concerns', 'market volatility', 'sector rotation'];
        const sources = ['MoneyControl', 'Economic Times', 'Business Standard', 'Mint', 'Business Today'];
        
        const template = this.newsTemplates[Math.floor(Math.random() * this.newsTemplates.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const sector = sectors[Math.floor(Math.random() * sectors.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        
        let headline = template
            .replace('{action}', action)
            .replace('{sector}', sector)
            .replace('{company}', company)
            .replace('{reason}', reason)
            .replace('{points}', Math.floor(Math.random() * 500) + 50)
            .replace('{percentage}', (Math.random() * 5 + 0.5).toFixed(1))
            .replace('{amount}', Math.floor(Math.random() * 5000) + 1000)
            .replace('{month}', 'August')
            .replace('{sentiment}', Math.random() > 0.5 ? 'positive' : 'mixed');
        
        const isPositive = action.includes('gain') || action.includes('rall') || action.includes('surg');
        const sentiment = isPositive ? 'positive' : 'negative';
        const score = isPositive ? Math.random() * 0.8 + 0.2 : -(Math.random() * 0.8 + 0.2);
        
        return {
            id: Date.now(),
            headline: headline,
            source: source,
            timestamp: new Date().toISOString(),
            sentiment: sentiment,
            score: score
        };
    }

    simulateDataUpdate() {
        // Update overall sentiment with small random changes
        this.data.marketData.overallSentiment += (Math.random() - 0.5) * 2;
        this.data.marketData.overallSentiment = Math.max(-50, Math.min(50, this.data.marketData.overallSentiment));
        
        // Update article count
        this.data.marketData.totalArticlesToday += Math.floor(Math.random() * 3);
        
        // Update percentages (keeping them roughly balanced)
        const change = (Math.random() - 0.5) * 4;
        this.data.marketData.bullishPercentage = Math.max(20, Math.min(60, this.data.marketData.bullishPercentage + change));
        this.data.marketData.bearishPercentage = Math.max(15, Math.min(50, this.data.marketData.bearishPercentage - change/2));
        this.data.marketData.neutralPercentage = 100 - this.data.marketData.bullishPercentage - this.data.marketData.bearishPercentage;
        
        // Update prediction confidence
        this.data.marketData.predictionConfidence += (Math.random() - 0.5) * 6;
        this.data.marketData.predictionConfidence = Math.max(45, Math.min(95, this.data.marketData.predictionConfidence));
        
        // Update prediction direction based on sentiment
        this.data.marketData.prediction = this.data.marketData.overallSentiment > 5 ? 'UP' : 'DOWN';
        
        // Add new sentiment data point
        const newTime = new Date();
        const timeStr = newTime.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
        });
        
        this.data.sentimentTrend.timestamps.push(timeStr);
        this.data.sentimentTrend.values.push(this.data.marketData.overallSentiment);
        
        // Keep only last 8 data points
        if (this.data.sentimentTrend.timestamps.length > 8) {
            this.data.sentimentTrend.timestamps.shift();
            this.data.sentimentTrend.values.shift();
        }
        
        // Sometimes add new news item
        if (Math.random() > 0.7) {
            const newNews = this.generateRandomNews();
            this.data.sentimentFeed.unshift(newNews);
            
            // Keep only latest 10 items
            if (this.data.sentimentFeed.length > 10) {
                this.data.sentimentFeed.pop();
            }
            
            // Add to recent analysis
            this.data.recentAnalysis.unshift({
                time: newTime.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'Asia/Kolkata'
                }),
                headline: newNews.headline,
                source: newNews.source,
                sentiment: newNews.sentiment,
                score: newNews.score
            });
            
            // Keep only latest 20 items
            if (this.data.recentAnalysis.length > 20) {
                this.data.recentAnalysis.pop();
            }
        }
        
        this.data.marketData.lastUpdated = new Date().toISOString();
    }

    refreshData() {
        console.log('Refreshing data...'); // Debug log
        this.simulateDataUpdate();
        this.updateMetrics();
        this.updateCharts();
        this.renderSentimentFeed();
        this.renderAnalysisTable();
        this.updateDateTime();
        
        // Flash the refresh indicator
        const indicator = document.getElementById('status-dot');
        if (indicator) {
            indicator.style.backgroundColor = '#FFC185';
            setTimeout(() => {
                indicator.style.backgroundColor = 'var(--color-teal-300)';
            }, 200);
        }
    }

    updateCharts() {
        // Update sentiment gauge
        const sentimentValue = this.data.marketData.overallSentiment;
        if (this.charts.sentimentGauge) {
            this.charts.sentimentGauge.data.datasets[0].data = [
                Math.max(0, sentimentValue), 
                Math.max(0, -sentimentValue), 
                100 - Math.abs(sentimentValue)
            ];
            this.charts.sentimentGauge.update();
        }
        
        // Update trend chart
        if (this.charts.sentimentTrend) {
            this.charts.sentimentTrend.data.labels = this.data.sentimentTrend.timestamps;
            this.charts.sentimentTrend.data.datasets[0].data = this.data.sentimentTrend.values;
            this.charts.sentimentTrend.update();
        }
        
        // Update pie chart
        if (this.charts.sentimentPie) {
            this.charts.sentimentPie.data.datasets[0].data = [
                this.data.marketData.bullishPercentage,
                this.data.marketData.bearishPercentage,
                this.data.marketData.neutralPercentage
            ];
            this.charts.sentimentPie.update();
        }
        
        // Update prediction gauge
        if (this.charts.predictionGauge) {
            this.charts.predictionGauge.data.datasets[0].data = [
                this.data.marketData.predictionConfidence,
                100 - this.data.marketData.predictionConfidence
            ];
            this.charts.predictionGauge.update();
        }
    }

    toggleAutoRefresh(enabled) {
        this.isAutoRefreshEnabled = enabled;
        const indicator = document.getElementById('auto-refresh-indicator');
        
        if (enabled) {
            this.startAutoRefresh();
            if (indicator) {
                indicator.innerHTML = '<span class="refresh-icon">↻</span> Auto-refresh ON';
                indicator.style.opacity = '1';
            }
        } else {
            this.stopAutoRefresh();
            if (indicator) {
                indicator.innerHTML = '<span class="refresh-icon">↻</span> Auto-refresh OFF';
                indicator.style.opacity = '0.5';
            }
        }
    }

    updateRefreshInterval(interval) {
        this.refreshIntervalTime = interval;
        if (this.isAutoRefreshEnabled) {
            this.stopAutoRefresh();
            this.startAutoRefresh();
        }
    }

    startAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        this.autoRefreshInterval = setInterval(() => {
            this.refreshData();
        }, this.refreshIntervalTime); // 5 seconds
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    getContextualTime(publishedAt) {
        const status = this.marketStatus.getMarketStatus();
        const pubDate = new Date(publishedAt);
        const now = this.marketStatus.getCurrentIST();
        const diffMs = now - pubDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else {
            return pubDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata'
            });
        }
    }

    setupRefreshStrategy() {
        const status = this.marketStatus.getMarketStatus();
        
        if (status.showLiveData) {
            // Market is open - enable auto-refresh
            this.startAutoRefresh();
        } else {
            // Market is closed - disable auto-refresh
            this.stopAutoRefresh();
        }
    }

    async loadRealData() {
        try {
            const status = this.marketStatus.getMarketStatus();
            
            // Adjust data loading based on market status
            let newsLimit = 20;
            let timeFilter = '';
            
            if (status.status === 'CLOSED_WEEKEND') {
                // Weekend: Show Friday's data + weekend financial news
                const friday = this.marketStatus.getLastTradingDay();
                timeFilter = `&published_at.gte=${friday}T00:00:00`;
                newsLimit = 15;
            } else if (status.status === 'AFTER_HOURS') {
                // After hours: Show today's data
                const today = new Date().toISOString().split('T')[0];
                timeFilter = `&published_at.gte=${today}T00:00:00`;
            } else if (status.status === 'PRE_MARKET') {
                // Pre-market: Show overnight + previous day data
                const yesterday = new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0];
                timeFilter = `&published_at.gte=${yesterday}T15:30:00`;
            }

            // Load news from Supabase
            const response = await fetch(
                `${window.ENV_CONFIG.SUPABASE_URL}/rest/v1/market_news?select=*${timeFilter}&order=published_at.desc&limit=${newsLimit}`,
                {
                    headers: {
                        'apikey': window.ENV_CONFIG.SUPABASE_KEY,
                        'Authorization': `Bearer ${window.ENV_CONFIG.SUPABASE_KEY}`
                    }
                }
            );
            
            const newsData = await response.json();
            
            if (newsData && newsData.length > 0) {
                // Filter news based on market status
                const filteredNews = this.marketStatus.filterNewsForMarketStatus(newsData);
                
                // Update sentiment feed with context-aware time labels
                this.data.sentimentFeed = filteredNews.slice(0, 6).map(item => ({
                    source: item.source,
                    timestamp: item.published_at,
                    headline: item.title,
                    sentiment: this.getSentimentLabel(item.sentiment_score),
                    time: this.getContextualTime(item.published_at),
                    impact: item.impact_level || 'medium',
                    isLive: status.showLiveData
                }));

                // Update recent analysis
                this.data.recentAnalysis = filteredNews.slice(0, 20).map(item => ({
                    time: this.getContextualTime(item.published_at),
                    headline: item.title,
                    source: item.source,
                    sentiment: this.getSentimentLabel(item.sentiment_score),
                    score: item.sentiment_score
                }));

                // Update sentiment trends
                const trendData = this.processTrendData(filteredNews);
                this.data.sentimentTrend.timestamps = trendData.map(d => d.time);
                this.data.sentimentTrend.values = trendData.map(d => d.sentiment);

                // Update market metrics
                this.updateMarketMetrics(filteredNews);
            } else {
                // No data available - show appropriate message
                this.showNoDataMessage(status);
            }
            
        } catch (error) {
            console.error('Error loading real data:', error);
            this.loadMockData();
        }
    }

    showNoDataMessage(status) {
        const message = status.status === 'CLOSED_WEEKEND' 
            ? 'Weekend market closure - showing last trading day data'
            : 'No recent news available - check back during market hours';
            
        // Display appropriate message in UI
        const newsContainer = document.querySelector('#sentiment-feed');
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="no-data-message">
                    <div class="message-icon">📊</div>
                    <div class="message-text">${message}</div>
                    <div class="message-subtext">Market status: ${status.message}</div>
                </div>
            `;
        }
        
        // Load mock data as fallback
        this.loadMockData();
    }

    loadMockData() {
        // Mock data for testing
        const mockNews = [
            {
                time: '09:30',
                headline: 'SENSEX surges 500 points on positive global cues',
                source: 'Economic Times',
                sentiment: 'Bullish',
                sentiment_score: 0.85,
                impact: 'high'
            },
            {
                time: '09:45',
                headline: 'IT stocks rally as TCS beats earnings estimates',
                source: 'Moneycontrol',
                sentiment: 'Bullish',
                sentiment_score: 0.78,
                impact: 'medium'
            },
            {
                time: '10:15',
                headline: 'Banking sector faces pressure on RBI policy concerns',
                source: 'Business Standard',
                sentiment: 'Bearish',
                sentiment_score: -0.65,
                impact: 'high'
            },
            {
                time: '10:30',
                headline: 'Pharma stocks gain momentum on US FDA approvals',
                source: 'Livemint',
                sentiment: 'Bullish',
                sentiment_score: 0.72,
                impact: 'medium'
            },
            {
                time: '11:00',
                headline: 'FII inflows cross ₹2000 crore mark today',
                source: 'CNBC TV18',
                sentiment: 'Bullish',
                sentiment_score: 0.88,
                impact: 'high'
            },
            {
                time: '11:30',
                headline: 'Metal stocks under pressure on China demand worries',
                source: 'Reuters',
                sentiment: 'Bearish',
                sentiment_score: -0.58,
                impact: 'medium'
            }
        ];

        this.data.sentimentFeed = mockNews.slice(0, 6);
        this.data.recentAnalysis = mockNews;

        // Mock sentiment trend data
        const now = new Date();
        this.data.sentimentTrend.timestamps = Array.from({length: 8}, (_, i) => 
            new Date(now - (7-i) * 3600000).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})
        );
        this.data.sentimentTrend.values = [0.65, 0.72, 0.68, 0.75, 0.71, 0.78, 0.74, 0.76];

        // Mock market metrics
        this.data.marketData = {
            overallSentiment: 0.74,
            totalArticlesToday: 156,
            bullishPercentage: 68,
            bearishPercentage: 25,
            neutralPercentage: 7,
            predictionConfidence: 0.89,
            prediction: "UP",
            lastUpdated: new Date().toISOString()
        };

        // Mock sources
        this.data.sources = [
            { name: 'Economic Times', count: 45, percentage: 29 },
            { name: 'Moneycontrol', count: 38, percentage: 24 },
            { name: 'Business Standard', count: 32, percentage: 21 },
            { name: 'Livemint', count: 25, percentage: 16 },
            { name: 'Reuters', count: 16, percentage: 10 }
        ];

        this.updateMetrics();
        this.updateCharts();
    }
    
    renderCharts() {
        this.updateCharts();
    }
    
    updateCharts() {
        // Update sentiment gauge
        if (this.charts.sentimentGauge) {
            const value = this.data.marketData.overallSentiment || 0;
            this.charts.sentimentGauge.data.datasets[0].data = [
                Math.max(0, value), 
                Math.max(0, -value), 
                100 - Math.abs(value)
            ];
            this.charts.sentimentGauge.update();
        }
        
        // Update sentiment trend chart
        if (this.charts.sentimentTrend) {
            this.charts.sentimentTrend.data.labels = this.data.sentimentTrend.timestamps;
            this.charts.sentimentTrend.data.datasets[0].data = this.data.sentimentTrend.values;
            this.charts.sentimentTrend.update();
        }
        
        // Update sentiment pie chart
        if (this.charts.sentimentPie) {
            this.charts.sentimentPie.data.datasets[0].data = [
                this.data.marketData.bullishPercentage || 0,
                this.data.marketData.bearishPercentage || 0,
                this.data.marketData.neutralPercentage || 0
            ];
            this.charts.sentimentPie.update();
        }
        
        // Update prediction gauge
        if (this.charts.predictionGauge) {
            const confidence = this.data.marketData.predictionConfidence || 0;
            this.charts.predictionGauge.data.datasets[0].data = [confidence, 100 - confidence];
            this.charts.predictionGauge.update();
        }
    }

    getSentimentLabel(score) {
        if (score > 0.1) return 'positive';
        if (score < -0.1) return 'negative';
        return 'neutral';
    }

    processTrendData(newsData) {
        // Group by hour and calculate average sentiment for last 8 hours
        const hourlyData = {};
        const now = new Date();
        
        for (let i = 7; i >= 0; i--) {
            const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
            const hourStr = hour.toLocaleTimeString('en-IN', { 
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata'
            });
            hourlyData[hourStr] = [];
        }

        newsData.forEach(item => {
            const itemTime = new Date(item.published_at);
            const hourStr = itemTime.toLocaleTimeString('en-IN', { 
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata'
            });
            if (hourlyData[hourStr]) {
                hourlyData[hourStr].push(item.sentiment_score);
            }
        });

        return Object.entries(hourlyData).map(([time, scores]) => ({
            time,
            sentiment: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
        }));
    }

    updateMarketMetrics(newsData) {
        if (newsData.length === 0) return;

        const sentiments = newsData.map(item => item.sentiment_score);
        const positive = sentiments.filter(s => s > 0.1).length;
        const negative = sentiments.filter(s => s < -0.1).length;
        const neutral = sentiments.length - positive - negative;

        this.data.marketData.overallSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length * 100;
        this.data.marketData.bullishPercentage = Math.round((positive / sentiments.length) * 100);
        this.data.marketData.bearishPercentage = Math.round((negative / sentiments.length) * 100);
        this.data.marketData.neutralPercentage = Math.round((neutral / sentiments.length) * 100);
        this.data.marketData.totalArticlesToday = newsData.length;
        this.data.marketData.predictionConfidence = Math.min(95, Math.max(50, Math.abs(this.data.marketData.overallSentiment)));
        this.data.marketData.prediction = this.data.marketData.overallSentiment > 5 ? 'UP' : 'DOWN';
    }

    exportData() {
        console.log('Exporting data...'); // Debug log
        const exportData = {
            timestamp: new Date().toISOString(),
            marketData: this.data.marketData,
            sentimentFeed: this.data.sentimentFeed,
            recentAnalysis: this.data.recentAnalysis,
            sources: this.data.sources,
            sentimentTrend: this.data.sentimentTrend
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `sentiment-data-${new Date().toISOString().split('T')[0]}.json`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show confirmation
        alert('Data exported successfully! Check your downloads folder.');
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 1500);
        }
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Sentiment Dashboard...'); // Debug log
    new SentimentDashboard();
});