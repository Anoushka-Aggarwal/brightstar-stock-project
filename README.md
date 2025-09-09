## Vite Config

## Run scripts
```zsh
npm install
npm run dev
```

## API Usage

```javascript
import { marketDataAPI } from './simulator/sim.js';

useEffect(() => {
  const unsubscribe = marketDataAPI.subscribe((data) => {
    setStocks(data);
  });
  
  marketDataAPI.start();
  
  return () => {
    unsubscribe();
    marketDataAPI.stop();
  };
}, []);
```

# TODO 
### -> TABLE
- Real-time table display
- Color-coded price changes
- use ANT Design tables [https://ant.design/components/table]
-- add sorting to Relevant Columns (follow up questions related to this)
-- refer, TradingView Screener Nasdaq 100 for design inspiration
-- research Finance friendly fonts, and use them. place .wolff files in /public folder

### -> Line Chart
- The simulated snapshot data should be plotted live as a line chart (single series) of close LTP value every 10seconds.[no backfill, you can use states within jsx, or store the snapshot from the start of dev website in chrome local storage]
- Library - Highcharts [https://api.highcharts.com/highcharts/series.line]
- plot just two symbols, GOOG and NVDA, LTP(price) vs system time(windows time)
- The line should have markers for each 10 second close.
- markers should be visible only on hover
- crosshair = free move
- tooltip = just show the close LTP value


### -> Websites you can refer: 
- smartoptions.com [https://smartoptions.trendlyne.com/dashboard/options/30-sep-2025/]
- tradingview.com [https://www.tradingview.com/screener/4gzZXrYt/]
- cme.com [https://www.cmegroup.com/]
- simply wall st. [https://simplywall.st/]
- drw.com [https://www.drw.com/]
- maven securities [https://www.mavensecurities.com/]
- refinitiv (now named LSEG) [https://www.lseg.com/en/data-analytics]
- bloomberg [https://www.bloomberg.com/markets/watchlist]
- straddlechart.com [https://straddlechart.com/]

