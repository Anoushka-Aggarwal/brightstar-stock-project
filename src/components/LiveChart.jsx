import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { marketDataAPI } from "../simulator/sim";

// Storage key for local persistence
const STORAGE_KEY = "ltp_chart_data";

export default function LiveChart() {
  const [chartData, setChartData] = useState({ GOOG: [], NVDA: [] });

  // Load saved chart data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setChartData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let lastSnapshot = 0;

    const unsubscribe = marketDataAPI.subscribe((stocks) => {
      const now = Date.now();

      // Only take snapshot every 10s
      if (now - lastSnapshot >= 10000) {
        lastSnapshot = now;

        const goog = stocks.find((s) => s.symbol === "GOOG");
        const nvda = stocks.find((s) => s.symbol === "NVDA");

        if (goog && nvda) {
          setChartData((prev) => {
            const newData = {
              GOOG: [...prev.GOOG, [now, goog.price]],
              NVDA: [...prev.NVDA, [now, nvda.price]],
            };

            // Keep only last 10 minutes (600000 ms)
            const cutoff = now - 600000;
            newData.GOOG = newData.GOOG.filter(([t]) => t >= cutoff);
            newData.NVDA = newData.NVDA.filter(([t]) => t >= cutoff);

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

            return newData;
          });
        }
      }
    });

    marketDataAPI.start();

    return () => unsubscribe();
  }, []);

  const options = {
    chart: {
      type: "line",
      animation: Highcharts.svg,
      height: 400,
    },
    title: {
      text: "GOOG & NVDA LTP (Last 10 Minutes)",
    },
    xAxis: {
      type: "datetime",
      title: { text: "System Time" },
      crosshair: true, // free move crosshair
    },
    yAxis: {
      title: { text: "LTP (USD)" },
    },
    tooltip: {
      shared: false,
      formatter: function () {
        return `${this.y.toFixed(2)}`;
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
          states: {
            hover: { enabled: true }, // only visible on hover
          },
        },
      },
    },
    series: [
      {
        name: "GOOG",
        data: chartData.GOOG,
        color: "red",
      },
      {
        name: "NVDA",
        data: chartData.NVDA,
        color: "green",
      },
    ],
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
