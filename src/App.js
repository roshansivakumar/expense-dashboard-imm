import React from "react";
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
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "$0.00";
    return `$${parseFloat(value).toFixed(2)}`;
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

  return (
    <div className="App">
      <h1>Expense Analysis: {months.join(", ")} 2025</h1>

      {/* Monthly Totals */}
      <div className="card-container">
        {months.map((month) => (
          <div key={month} className="card">
            <h2>{month} 2025</h2>
            <p className="total">{formatCurrency(monthlyTotals[month])}</p>
          </div>
        ))}
      </div>

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
            March spending was more diversified across 6 different categories -
            prototyping and dev
          </li>
          <li>
            Capability development became a major expense area in March (49.5%
            of total)
          </li>
        </ul>
      </div>
    </div>
  );
}
