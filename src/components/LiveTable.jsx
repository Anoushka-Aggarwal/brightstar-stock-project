import React from "react";
import { Table } from "antd";
import "antd/dist/reset.css";
import "./LiveTable.css"; // import custom styles

export default function LiveTable({ stocks, prevStocks }) {
  const getPriceChange = (symbol, price) => {
    const prev = prevStocks.find((s) => s.symbol === symbol);
    if (!prev) return 0;
    return price - prev.price;
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
    },
    {
      title: "Price",
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
      dataIndex: "priceChange", // coming from your sim.js
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
