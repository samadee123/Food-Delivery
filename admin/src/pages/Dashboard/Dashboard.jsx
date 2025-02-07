import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState(null);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${url}/api/dashboard/stats`);
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, [url]);

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard">
      <h2>📊 Admin Dashboard</h2>

      {/* Orders Stats */}
      <div className="dashboard-section">
        <h3>🛒 Orders Summary</h3><br/>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h4>Total Orders</h4>
            <p>{stats.orders.totalOrders}</p>
          </div>
          <div className="stat-card pending">
            <h4>Pending Orders</h4>
            <p>{stats.orders.pendingOrders}</p>
          </div>
          <div className="stat-card completed">
            <h4>Completed Orders</h4>
            <p>{stats.orders.completedOrders}</p>
          </div>
          <div className="stat-card revenue">
            <h4>Total Revenue</h4>
            <p>Rs. {stats.orders.revenue.toFixed(2)}</p>
          </div>
          <div className="stat-card avg">
            <h4>Avg Order Value</h4>
            <p>Rs. {stats.orders.averageOrderValue}</p>
          </div>
        </div>
      </div>

      {/* Users Stats */}
      <div className="dashboard-section">
        <h3>👥 Users Overview</h3><br/>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{stats.users.totalUsers}</p>
          </div>
          <div className="stat-card repeat">
            <h4>Repeat Customers</h4>
            <p>{stats.users.repeatCustomerCount}</p>
          </div>
        </div>

        {/* Users Pie Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "New Users", value: stats.users.newUsers },
                { name: "Repeat Customers", value: stats.users.repeatCustomerCount }
              ]}
              cx="50%" cy="50%"
              outerRadius={100}
              label
            >
              <Cell fill="#0088FE" />
              <Cell fill="#00C49F" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling & Least Selling Items */}
      <div className="dashboard-section">
        <h3>📈 Top & Least Selling Items</h3><br></br>
        <div className="dashboard-grid">
          <div className="grid-column">
            <h4 className="top-selling-header">🔥 Top Selling Items</h4><br/>
            {stats.inventory.mostSoldItems.map((item, index) => (
              <div key={index} className="item-card top-selling">
                <p>{item._id}</p>
                <span>{item.count} sold</span>
              </div>
            ))}
          </div>

          <div className="grid-column">
            <h4 className="least-selling-header">📉 Least Selling Items</h4><br/>
            {stats.inventory.leastSoldItems.map((item, index) => (
              <div key={index} className="item-card least-selling">
                <p>{item._id}</p>
                <span>{item.count} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coupon Stats */}
      <div className="dashboard-section">
        <h3>🎟️ Coupon Usage</h3>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h4>Total Coupons Used</h4>
            <p>{stats.coupons.totalCouponsUsed}</p>
          </div>
          <div className="stat-card">
            <h4>Unused Coupons</h4>
            <p>{stats.coupons.unusedCoupons}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
