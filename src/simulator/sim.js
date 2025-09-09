// Market data simulator with randomized intervals per stock
const INITIAL_MARKET_DATA = [
  {
    symbol: 'NVDA',
    description: 'NVIDIA Corporation',
    price: 169.81,
    priceChange: 1.67,
    volume: 44084161,
    marketCap: 4126383105555.29,
    sector: 'Electronic technology',
    open: 167.55,
    high: 170.96,
    low: 167.35,
  },
  {
    symbol: 'MSFT',
    description: 'Microsoft Corporation',
    price: 498.955,
    priceChange: 0.80,
    volume: 3928004,
    marketCap: 3708815592956.95,
    sector: 'Technology services',
    open: 498.105,
    high: 500.21,
    low: 495.03,
  },
  {
    symbol: 'AAPL',
    description: 'Apple Inc.',
    price: 239.645,
    priceChange: -0.02,
    volume: 10484853,
    marketCap: 3556425213524.02,
    sector: 'Electronic technology',
    open: 239.3,
    high: 240.15,
    low: 238.74,
  },
  {
    symbol: 'GOOG',
    description: 'Alphabet Inc.',
    price: 237.41,
    priceChange: 0.95,
    volume: 5012790,
    marketCap: 2870092859252.59,
    sector: 'Technology services',
    open: 235.79,
    high: 238.4,
    low: 235.35,
  },
  {
    symbol: 'GOOGL',
    description: 'Alphabet Inc.',
    price: 237.125,
    priceChange: 0.90,
    volume: 7984287,
    marketCap: 2868721187147.94,
    sector: 'Technology services',
    open: 235.47,
    high: 238.13,
    low: 235.08,
  },
  {
    symbol: 'AMZN',
    description: 'Amazon.com, Inc.',
    price: 233.95,
    priceChange: 0.70,
    volume: 6458574,
    marketCap: 2495056207652.35,
    sector: 'Retail trade',
    open: 234.94,
    high: 235.49,
    low: 233.75,
  },
  {
    symbol: 'META',
    description: 'Meta Platforms, Inc.',
    price: 760.375,
    priceChange: 1.05,
    volume: 2426256,
    marketCap: 1910033442668.53,
    sector: 'Technology services',
    open: 755.995,
    high: 766.51,
    low: 755.5,
  },
  {
    symbol: 'AVGO',
    description: 'Broadcom Inc.',
    price: 352.17,
    priceChange: 5.16,
    volume: 12692620,
    marketCap: 1656421521931.62,
    sector: 'Electronic technology',
    open: 342.75,
    high: 354.17,
    low: 341.25,
  },
  {
    symbol: 'TSLA',
    description: 'Tesla, Inc.',
    price: 351.15,
    priceChange: 0.09,
    volume: 20861651,
    marketCap: 1132616395611.69,
    sector: 'Consumer durables',
    open: 354.64,
    high: 358.44,
    low: 350.2,
  },
  {
    symbol: 'NFLX',
    description: 'Netflix, Inc.',
    price: 1249.83,
    priceChange: 0.48,
    volume: 499202,
    marketCap: 531085652798.43,
    sector: 'Technology services',
    open: 1248.54,
    high: 1252.04,
    low: 1232,
  },
  {
    symbol: 'COST',
    description: 'Costco Wholesale Corporation',
    price: 961.985,
    priceChange: -0.16,
    volume: 214440,
    marketCap: 426618291404.90,
    sector: 'Retail trade',
    open: 963.73,
    high: 966.13,
    low: 958.59,
  },
  {
    symbol: 'PLTR',
    description: 'Palantir Technologies Inc.',
    price: 156.5647,
    priceChange: 2.26,
    volume: 15601149,
    marketCap: 371425402444.10,
    sector: 'Technology services',
    open: 154.91,
    high: 158.3,
    low: 154.84,
  },
  {
    symbol: 'ASML',
    description: 'ASML Holding NV Sponsored ADR',
    price: 790.25,
    priceChange: 1.09,
    volume: 286304,
    marketCap: 299808704045.83,
    sector: 'Electronic technology',
    open: 789.65,
    high: 792.64,
    low: 786.75,
  },
  {
    symbol: 'TMUS',
    description: 'T-Mobile US, Inc.',
    price: 243.695,
    priceChange: -3.59,
    volume: 1670830,
    marketCap: 274258963917.46,
    sector: 'Communications',
    open: 241.125,
    high: 244.43,
    low: 237.4,
  },
  {
    symbol: 'CSCO',
    description: 'Cisco Systems, Inc.',
    price: 66.895,
    priceChange: -0.01,
    volume: 2117671,
    marketCap: 264449120783.44,
    sector: 'Electronic technology',
    open: 66.72,
    high: 67.005,
    low: 66.35,
  },
  {
    symbol: 'AZN',
    description: 'AstraZeneca PLC Sponsored ADR',
    price: 80.48,
    priceChange: -1.49,
    volume: 440961,
    marketCap: 253136611742.64,
    sector: 'Health technology',
    open: 80.73,
    high: 80.77,
    low: 80.18,
  },
  {
    symbol: 'AMD',
    description: 'Advanced Micro Devices, Inc.',
    price: 149.91,
    priceChange: -0.81,
    volume: 13714196,
    marketCap: 243280505579.56,
    sector: 'Electronic technology',
    open: 151.8,
    high: 152.55,
    low: 149.22,
  },
  {
    symbol: 'LIN',
    description: 'Linde plc',
    price: 470.855,
    priceChange: 0.28,
    volume: 173250,
    marketCap: 220788399068.13,
    sector: 'Process industries',
    open: 469.66,
    high: 471.71,
    low: 466.6,
  }
];

class MarketDataAPI {
  constructor() {
    this.currentData = JSON.parse(JSON.stringify(INITIAL_MARKET_DATA));
    this.subscribers = new Set();
    this.updateTimers = new Map(); // per-stock update timers
    this.isRunning = false;
    
    this.initializeStockTimers();
  }

  initializeStockTimers() {
    this.currentData.forEach(stock => {
      this.updateTimers.set(stock.symbol, {
        interval: this.getRandomInterval(),
        lastUpdate: Date.now()
      });
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.getCurrentData()); // send initial data
    
    return () => this.subscribers.delete(callback);
  }

  getCurrentData() {
    return JSON.parse(JSON.stringify(this.currentData));
  }

  getStock(symbol) {
    const stock = this.currentData.find(s => s.symbol === symbol);
    return stock ? JSON.parse(JSON.stringify(stock)) : null;
  }

  getRandomInterval() {
    return Math.floor(Math.random() * 3500) + 500; // 500-4000ms
  }

  generatePriceMovement() {
    return (Math.random() - 0.5) * 0.04; // ±2%
  }

  generateVolumeChange() {
    return (Math.random() - 0.5) * 0.3; // ±15%
  }

  updateSingleStock(stockIndex) {
    const stock = this.currentData[stockIndex];
    if (!stock) return;

    const priceMovement = this.generatePriceMovement();
    const volumeChange = this.generateVolumeChange();
    
    const newPrice = Math.max(0.01, stock.price * (1 + priceMovement));
    const changeFluctuation = (Math.random() - 0.5) * 0.8;
    const newPriceChange = stock.priceChange + changeFluctuation;
    const newVolume = Math.max(1000, Math.floor(stock.volume * (1 + volumeChange)));
    
    const priceRatio = newPrice / stock.price;
    const newMarketCap = stock.marketCap * priceRatio;
    const newHigh = Math.max(stock.high, newPrice);
    const newLow = Math.min(stock.low, newPrice);

    this.currentData[stockIndex] = {
      ...stock,
      price: Number(newPrice.toFixed(4)),
      priceChange: Number(newPriceChange.toFixed(2)),
      volume: newVolume,
      marketCap: Number(newMarketCap.toFixed(2)),
      high: Number(newHigh.toFixed(4)),
      low: Number(newLow.toFixed(4)),
      lastUpdated: Date.now()
    };

    this.notifySubscribers();
  }

  notifySubscribers() {
    const data = this.getCurrentData();
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Subscriber callback error:', error);
      }
    });
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // start individual update cycles for each stock
    this.currentData.forEach((_, index) => {
      this.scheduleStockUpdate(index);
    });
  }

  scheduleStockUpdate(stockIndex) {
    if (!this.isRunning) return;

    const stock = this.currentData[stockIndex];
    const newInterval = this.getRandomInterval();
    
    const timeoutId = setTimeout(() => {
      if (this.isRunning) {
        this.updateSingleStock(stockIndex);
        this.scheduleStockUpdate(stockIndex); // reschedule
      }
    }, newInterval);

    this.updateTimers.set(stock.symbol, {
      ...this.updateTimers.get(stock.symbol),
      timeoutId,
      interval: newInterval
    });
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    // clear all timers
    this.updateTimers.forEach((timerInfo) => {
      if (timerInfo.timeoutId) {
        clearTimeout(timerInfo.timeoutId);
      }
    });
  }

  reset() {
    this.currentData = JSON.parse(JSON.stringify(INITIAL_MARKET_DATA));
    this.initializeStockTimers();
    this.notifySubscribers();
  }
}

export const marketDataAPI = new MarketDataAPI();
export default marketDataAPI;