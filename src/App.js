import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./styles.css";

// DATA SECTION - Update this part when you have new data
// =======================================================
const categoryData = [
  { category: "Blitz", February: 530.52, March: 37.58, April: 0, May: 0 },
  { category: "Capability", February: 0, March: 238.57, April: 0, May: 0 },
  { category: "BLE", February: 0, March: 88.84, April: 0, May: 0 },
  { category: "General", February: 0, March: 62.63, April: 0, May: 0 },
  { category: "Others", February: 0, March: 38.06, April: 0, May: 0 },
  { category: "Sound", February: 0, March: 15.96, April: 0, May: 0 },
];

// Sample data for top purchases per month
const topPurchasesData = {
  February: [
    { item: "HV500", amount: 198.5 },
    { item: "FNIRSI 1013D", amount: 140.25 },
    { item: "Signal & Power Book", amount: 85.99 },
    { item: "Fast Analytical Book", amount: 75.78 },
    { item: "Fishing Light 35000lm", amount: 65.5 },
  ],
  March: [
    { item: "Capability Module XZ", amount: 150.75 },
    { item: "BLE Developer Kit", amount: 88.84 },
    { item: "System Interface", amount: 62.63 },
    { item: "Sound Module", amount: 15.96 },
    { item: "Other Components", amount: 38.06 },
  ],
  April: [],
  May: [],
};

// Add all months you're tracking here
const months = ["February", "March", "April", "May"];

// Calculate monthly totals automatically
const monthlyTotals = {};
months.forEach((month) => {
  monthlyTotals[month] = categoryData.reduce(
    (sum, item) => sum + (item[month] || 0),
    0
  );
});

// Colors for categories
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
];
// =======================================================

export default function App() {
  // State to track selected month for top purchases view
  const [topPurchasesMonth, setTopPurchasesMonth] = useState(null);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "$0.00";
    return `${parseFloat(value).toFixed(2)}`;
  };

  // Generate pie chart data for each month
  const pieChartData = {};
  months.forEach((month) => {
    pieChartData[month] = categoryData
      .filter((item) => item[month] > 0)
      .map((item) => ({
        name: item.category,
        value: item[month],
        percentage: ((item[month] / (monthlyTotals[month] || 1)) * 100).toFixed(
          1
        ),
      }));
  });

  // Helper function to render top purchases for a specific month
  const renderTopPurchases = (month) => {
    const purchases = topPurchasesData[month] || [];

    if (purchases.length === 0) {
      return (
        <div className="no-data">
          <p>No purchases recorded for {month}</p>
        </div>
      );
    }

    // Find the maximum amount for scaling
    const maxAmount = Math.max(...purchases.map((item) => item.amount));

    return (
      <div className="top-purchases">
        <h2>Top 5 Highest Purchases - {month}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={purchases}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={formatCurrency}
              domain={[0, maxAmount * 1.1]}
            />
            <YAxis dataKey="item" type="category" width={120} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar
              dataKey="amount"
              fill="#2196F3"
              name={`${month} Purchases`}
              label={{
                position: "right",
                formatter: (value) => formatCurrency(value),
              }}
            />
          </BarChart>
        </ResponsiveContainer>
        <button
          className="back-button"
          onClick={() => setTopPurchasesMonth(null)}
        >
          Back to Dashboard
        </button>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Expense Analysis: {months.join(", ")} 2025</h1>

      {/* Monthly Totals with Top Purchases Tab */}
      <div className="card-container">
        {months.map((month) => (
          <div key={month} className="card">
            <h2>{month} 2025</h2>
            <p className="total">{formatCurrency(monthlyTotals[month])}</p>
            {monthlyTotals[month] > 0 && (
              <div className="tab-container">
                <button
                  className="top-purchases-btn"
                  onClick={() => setTopPurchasesMonth(month)}
                >
                  Top Purchases
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conditional rendering of top purchases or main dashboard */}
      {topPurchasesMonth ? (
        renderTopPurchases(topPurchasesMonth)
      ) : (
        <>
          {/* Category Comparison Chart */}
          <div className="chart-container">
            <h2>Expense by Category</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={categoryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                {months.map((month, index) => (
                  <Bar
                    key={month}
                    dataKey={month}
                    fill={COLORS[index % COLORS.length]}
                    name={`${month} 2025`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Distribution Pie Charts */}
          <div className="pie-container">
            {months
              .filter((month) => monthlyTotals[month] > 0)
              .map((month) => (
                <div key={month} className="pie-card">
                  <h2>{month} Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData[month] || []}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percentage }) =>
                          name && percentage ? `${name}: ${percentage}%` : ""
                        }
                      >
                        {(pieChartData[month] || []).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
          </div>

          {/* Key Insights */}
          <div className="insights-container">
            <h2>Key Insights</h2>
            <ul>
              <li>February expenses were entirely in the Blitz category</li>
              <li>
                March spending was more diversified across 6 different
                categories - prototyping and dev
              </li>
              <li>
                Capability development became a major expense area in March
                (49.5% of total)
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
