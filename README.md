## Quick Start

```bash
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

## TODO 
-> TABLE
- Real-time table display
- Color-coded price changes
- use ANT Design tables
-- add sorting to Relevant Columns (follow up questions related to this)
-- refer, TradingView Screener Nasdaq 100 for design inspiration
-- research Finance friendly fonts, and use them. place .wolff files in /public folder

-> Line Chart
- The simulated snapshot data should be plotted live as a line chart of close LTP value every 10seconds.[no backfill, you can use states within jsx, or store the snapshot from the start of dev website in chrome local storage]
- Library - Highcharts
- plot just two symbols, GOOG and NVDA, LTP(price) vs system time(windows time)
- The line should have markers for each 10 second close.
- markers should be visible only on hover
- crosshair = free move
- tooltip = just show the close LTP value


-> Websites you can refer: 
    smartoptions.com
    tradingview.com
    cme.com
    drw.com
    maven securities
    refinitiv

