// Market Status and Time Logic for Stock Sentiment Dashboard
class MarketStatus {
    constructor() {
        this.timezone = 'Asia/Kolkata';
        this.marketOpenHour = 9;
        this.marketOpenMinute = 15;
        this.marketCloseHour = 15;
        this.marketCloseMinute = 30;
    }

    getCurrentIST() {
        // Get current time in IST
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ist = new Date(utc + (5.5 * 3600000)); // IST is UTC+5:30
        return ist;
    }

    isWeekend(date = null) {
        const checkDate = date || this.getCurrentIST();
        const day = checkDate.getDay();
        return day === 0 || day === 6; // Sunday = 0, Saturday = 6
    }

    isMarketHours(date = null) {
        const checkDate = date || this.getCurrentIST();
        
        // Check if weekend
        if (this.isWeekend(checkDate)) {
            return false;
        }

        const hour = checkDate.getHours();
        const minute = checkDate.getMinutes();
        
        // Market: 9:15 AM - 3:30 PM IST
        const marketOpen = hour > this.marketOpenHour || 
                          (hour === this.marketOpenHour && minute >= this.marketOpenMinute);
        const marketClose = hour < this.marketCloseHour || 
                           (hour === this.marketCloseHour && minute <= this.marketCloseMinute);
        
        return marketOpen && marketClose;
    }

    getMarketStatus() {
        const now = this.getCurrentIST();
        const hour = now.getHours();
        const minute = now.getMinutes();
        
        if (this.isWeekend()) {
            return {
                status: 'CLOSED_WEEKEND',
                message: '🔴 Market Closed - Weekend',
                description: 'Indian stock markets are closed on weekends',
                nextOpen: this.getNextMarketOpen(),
                showLiveData: false,
                dataContext: 'Last Trading Day'
            };
        }
        
        if (this.isMarketHours()) {
            return {
                status: 'OPEN',
                message: '🟢 Market Open',
                description: 'Live trading in progress',
                showLiveData: true,
                dataContext: 'Real-time'
            };
        }
        
        // Check if pre-market or after-hours
        const currentTime = hour * 60 + minute;
        const marketOpenTime = this.marketOpenHour * 60 + this.marketOpenMinute;
        const marketCloseTime = this.marketCloseHour * 60 + this.marketCloseMinute;
        
        if (currentTime < marketOpenTime) {
            return {
                status: 'PRE_MARKET',
                message: '🟡 Pre-Market',
                description: 'Market opens at 9:15 AM IST',
                nextOpen: this.getNextMarketOpen(),
                showLiveData: false,
                dataContext: 'Pre-Market News'
            };
        } else {
            return {
                status: 'AFTER_HOURS',
                message: '🟡 After Hours',
                description: 'Market closed at 3:30 PM IST',
                nextOpen: this.getNextMarketOpen(),
                showLiveData: false,
                dataContext: 'Closing Summary'
            };
        }
    }

    getNextMarketOpen() {
        const now = this.getCurrentIST();
        let nextOpen = new Date(now);
        
        // If it's weekend, next open is Monday
        if (this.isWeekend()) {
            const daysUntilMonday = (8 - now.getDay()) % 7;
            nextOpen.setDate(now.getDate() + daysUntilMonday);
        }
        // If it's after market hours today, next open is tomorrow (unless tomorrow is weekend)
        else if (!this.isMarketHours() && now.getHours() >= this.marketCloseHour) {
            nextOpen.setDate(now.getDate() + 1);
            // If tomorrow is Saturday, make it Monday
            if (nextOpen.getDay() === 6) {
                nextOpen.setDate(nextOpen.getDate() + 2);
            }
        }
        
        // Set to market open time
        nextOpen.setHours(this.marketOpenHour, this.marketOpenMinute, 0, 0);
        
        return nextOpen;
    }

    getTimeUntilMarketOpen() {
        const nextOpen = this.getNextMarketOpen();
        const now = this.getCurrentIST();
        const diff = nextOpen - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    shouldShowRealTimeData() {
        return this.getMarketStatus().showLiveData;
    }

    getDataContextLabel() {
        return this.getMarketStatus().dataContext;
    }

    // Filter news based on market status
    filterNewsForMarketStatus(newsItems) {
        const status = this.getMarketStatus();
        
        if (status.status === 'CLOSED_WEEKEND') {
            // Weekend: Show only major financial news
            return newsItems.filter(item => {
                const headline = (item.headline || item.title || '').toLowerCase();
                return headline.includes('rbi') || 
                       headline.includes('policy') || 
                       headline.includes('budget') ||
                       headline.includes('global') ||
                       headline.includes('fed') ||
                       headline.includes('s&p') ||
                       headline.includes('nasdaq') ||
                       headline.includes('sebi');
            });
        }
        
        if (status.status === 'PRE_MARKET') {
            // Pre-market: Show overnight developments and global cues
            return newsItems.filter(item => {
                const headline = (item.headline || item.title || '').toLowerCase();
                return headline.includes('global') || 
                       headline.includes('overnight') ||
                       headline.includes('asia') ||
                       headline.includes('europe') ||
                       headline.includes('us markets') ||
                       headline.includes('sgx');
            });
        }
        
        if (status.status === 'AFTER_HOURS') {
            // After hours: Show results and major announcements
            return newsItems.filter(item => {
                const headline = (item.headline || item.title || '').toLowerCase();
                return headline.includes('results') || 
                       headline.includes('earnings') ||
                       headline.includes('announcement') ||
                       headline.includes('closing') ||
                       headline.includes('board meeting');
            });
        }
        
        // Market open: Show all news
        return newsItems;
    }

    getLastTradingDay() {
        const now = this.getCurrentIST();
        let lastTrading = new Date(now);
        
        if (this.isWeekend()) {
            // If weekend, last trading was Friday
            const daysBack = now.getDay() === 0 ? 2 : 1; // Sunday = 2 days back, Saturday = 1 day back
            lastTrading.setDate(now.getDate() - daysBack);
        } else if (!this.isMarketHours() && now.getHours() >= this.marketCloseHour) {
            // If after hours, today was the last trading day
            // Keep today
        } else if (now.getHours() < this.marketOpenHour) {
            // If pre-market, last trading was yesterday
            lastTrading.setDate(now.getDate() - 1);
            // If yesterday was weekend, go back to Friday
            if (lastTrading.getDay() === 0) lastTrading.setDate(lastTrading.getDate() - 2);
            if (lastTrading.getDay() === 6) lastTrading.setDate(lastTrading.getDate() - 1);
        }
        
        return lastTrading.toISOString().split('T')[0];
    }
}