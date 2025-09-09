import React, { useEffect, useState } from 'react';
import LiveTable from './components/LiveTable';
import LiveChart from './components/LiveChart';
import { marketDataAPI } from './simulator/sim.js';
import './index.css';

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [prevStocks, setPrevStocks] = useState([]);

  useEffect(() => {
    const unsubscribe = marketDataAPI.subscribe((data) => {
      setPrevStocks(stocks);
      setStocks(data);
    });
    marketDataAPI.start();
    return () => {
      unsubscribe();
      marketDataAPI.stop();
    };
    // eslint-disable-next-line
  }, []);

  console.log('Appewefwe fiewjf');
  return (
    <div style={{ padding: '20px', backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh' }}>
    <h1>Stock Dashboard</h1>
    <LiveTable stocks={stocks} prevStocks={prevStocks} />
    <div style={{ marginTop: '40px' }}>
      <LiveChart stocks={stocks} />
    </div>
  </div>  
  );
}
