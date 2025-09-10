import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility"; // Import accessibility module
import { marketDataAPI } from "../simulator/sim";

// Initialize the accessibility module
if (typeof AccessibilityModule === "function") {
  AccessibilityModule(Highcharts);
}

// Key to persist chart data in localStorage
const STORAGE_KEY = "ltp_chart_data";

export default function LiveChart() {
  // Chart data state: store timestamped price points for GOOG and NVDA
  const [chartData, setChartData] = useState({ GOOG: [], NVDA: [] });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setChartData(JSON.parse(saved));
    }
  }, []);

  // Subscribe to marketDataAPI and update chart every 10s
  useEffect(() => {
    let lastSnapshot = 0;

    const unsubscribe = marketDataAPI.subscribe((stocks) => {
      const now = Date.now();

      // Take snapshot only every 10 seconds
      if (now - lastSnapshot >= 10000) {
        lastSnapshot = now;

        // Find the stock objects for GOOG and NVDA
        const goog = stocks.find((s) => s.symbol === "GOOG");
        const nvda = stocks.find((s) => s.symbol === "NVDA");

        if (goog && nvda) {
          setChartData((prev) => {
            // Append new data point to previous chart data
            const newData = {
              GOOG: [...prev.GOOG, [now, goog.price]],
              NVDA: [...prev.NVDA, [now, nvda.price]],
            };

            // Keep only last 10 minutes of data
            const cutoff = now - 600000; // 10 minutes in ms
            newData.GOOG = newData.GOOG.filter(([t]) => t >= cutoff);
            newData.NVDA = newData.NVDA.filter(([t]) => t >= cutoff);

            // Persist updated chart data to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

            return newData;
          });
        }
      }
    });

    // Start market data stream
    marketDataAPI.start();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Highcharts options
  const options = {
    chart: {
      type: "line",
      animation: Highcharts.svg, // Smooth animation
      height: 400,
    },
    title: {
      text: "GOOG & NVDA LTP (Last 10 Minutes)",
    },
    xAxis: {
      type: "datetime",
      title: { text: "System Time" },
      crosshair: true,
    },
    yAxis: {
      title: { text: "LTP (USD)" },
    },
    tooltip: {
      shared: false,
      formatter: function () {
        // Show price with 2 decimal points
        return `${this.y.toFixed(2)}`;
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false, // Disable markers for performance
          states: {
            hover: { enabled: true }, // Show marker on hover
          },
        },
      },
    },
    series: [
      { name: "GOOG", data: chartData.GOOG, color: "red" },
      { name: "NVDA", data: chartData.NVDA, color: "green" },
    ],
    accessibility: {
      enabled: true, // Enable accessibility module to remove warning
    },
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
