import React from "react";
import { Table } from "antd";
import "antd/dist/reset.css";
import "./LiveTable.css";

export default function LiveTable({ stocks, prevStocks }) {
  const getPriceChange = (symbol, price) => {
    const prev = prevStocks.find((s) => s.symbol === symbol);
    if (!prev) return 0;
    return price - prev.price;
  };

  const formatVolume = (volume) => {
    if (volume >= 1_000_000) {
      return (volume / 1_000_000).toFixed(2) + "M";
    }
    if (volume >= 1_000) {
      return (volume / 1_000).toFixed(0) + "K";
    }
    return volume;
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol, record) => (
        <div className="symbol-cell">
          <span className="symbol-short">{symbol}</span>
          <span className="symbol-full">{record.description}</span>
        </div>
      ),
    },
    {
      title: "Last Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price, record) => {
        const change = getPriceChange(record.symbol, price);
        const className =
          change > 0 ? "price-up" : change < 0 ? "price-down" : "";
        return (
          <span className={className}>
            {price !== undefined && price !== null
              ? price.toFixed(2)
              : "-"}
          </span>
        );
      },
    },
    {
      title: "% Change",
      dataIndex: "priceChange",
      key: "priceChange",
      sorter: (a, b) => a.priceChange - b.priceChange,
      render: (change) => {
        const className =
          change > 0 ? "price-up" : change < 0 ? "price-down" : "";
        return (
          <span className={className}>
            {change !== undefined && change !== null
              ? change.toFixed(2) + "%"
              : "-"}
          </span>
        );
      },
    },
    {
      title: "Volume",
      dataIndex: "volume",
      key: "volume",
      sorter: (a, b) => a.volume - b.volume,
      render: (volume) => <span>{formatVolume(volume)}</span>,
    },
    {
      title: "Market Cap",
      dataIndex: "marketCap",
      key: "marketCap",
      sorter: (a, b) => a.marketCap - b.marketCap,
      render: (val) => (val ? (val / 1_000_000_000).toFixed(2) + "B" : "-"),
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
    },
    
  ];

  return (
    <Table
      dataSource={stocks}
      columns={columns}
      rowKey="symbol"
      pagination={false}
    />
  );
}
