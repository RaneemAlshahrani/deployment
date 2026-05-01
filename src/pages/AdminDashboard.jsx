import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesFilter, setSalesFilter] = useState("all");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/dashboard?salesFilter=${salesFilter}`
        );

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      }
    }

    fetchDashboard();
  }, [salesFilter]);

  const totalSales = dashboardData?.totalSales || 0;
  const totalOrders = dashboardData?.totalOrders || 0;
  const totalCustomers = dashboardData?.totalCustomers || 0;
  const totalProducts = dashboardData?.totalProducts || 0;

  const recentOrders = dashboardData?.recentOrders || [];
  const topProducts = dashboardData?.topProducts || [];
  const salesChartData = dashboardData?.salesChartData || [];
  const activityData = dashboardData?.activityData || [];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-GB");
  };

  return (
    <div
      className="purple-page"
      style={{
        minHeight: "100vh",
        padding: "26px 24px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="admin-dashboard-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "16px",
        }}
      >
        <AdminSidebar activePage="dashboard" />

        <div style={{ display: "grid", gap: "16px" }}>
          <div
            className="admin-top-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            <StatCard
              title="Total Sales"
              value={`$${totalSales.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              change="▲ dynamic from orders"
              changeColor="#3ea85b"
            />

            <StatCard
              title="Orders"
              value={totalOrders.toString()}
              change="▲ based on placed orders"
              changeColor="#3ea85b"
            />

            <StatCard
              title="Customers"
              value={totalCustomers.toString()}
              change="unique customer count"
              changeColor="#e76b4f"
            />

            <StatCard title="Products" value={totalProducts.toString()} />
          </div>

          <div
            className="admin-middle-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.45fr 1fr",
              gap: "16px",
            }}
          >
            <div style={panelStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h2 style={panelTitleStyle}>Sales Overview</h2>

                <select
                  style={selectStyle}
                  value={salesFilter}
                  onChange={(e) => setSalesFilter(e.target.value)}
                >
                  <option value="all">All Months</option>
                  <option value="last6">Last 6 Months</option>
                  <option value="last3">Last 3 Months</option>
                </select>
              </div>

              <div style={{ width: "100%", height: "180px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesChartData}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8f4bd8"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Recent Orders</h2>

              <div style={{ overflowX: "auto", borderRadius: "14px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "rgba(255,255,255,0.32)",
                    borderRadius: "14px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.45)" }}>
                      <th style={thStyle}>Order ID.</th>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <tr key={order._id || index}>
                          <td style={tdStyle}>
                            {order._id ? `#${order._id.slice(-5)}` : `#${1000 + index}`}
                          </td>

                          <td style={tdStyle}>
                            {order.customer?.fullName || order.userId || "User"}
                          </td>

                          <td style={tdStyle}>
                            $
                            {Number(order.totalPrice || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          <td style={tdStyle}>
                            <span
                              style={{
                                ...statusStyle,
                                background:
                                  order.status === "Shipped" ? "#b4e6b7" : "#ffd7a6",
                                color:
                                  order.status === "Shipped" ? "#2f9a3b" : "#d87017",
                              }}
                            >
                              {order.status || "Processing"}
                            </span>
                          </td>

                          <td style={tdStyle}>{formatDate(order.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={emptyCellStyle}>
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            className="admin-bottom-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.45fr 1fr",
              gap: "16px",
            }}
          >
            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Top Products</h2>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div
                      key={`${product.name}-${index}`}
                      style={{
                        width: "145px",
                        background: "rgba(255,255,255,0.16)",
                        border: "1px solid rgba(255,255,255,0.35)",
                        borderRadius: "22px",
                        padding: "16px 12px 12px",
                        textAlign: "center",
                      }}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "78px",
                            height: "78px",
                            objectFit: "contain",
                            marginBottom: "10px",
                          }}
                        />
                      )}

                      <h3
                        style={{
                          margin: "0 0 6px",
                          fontSize: "22px",
                          color: "#2e3d4c",
                          fontWeight: "500",
                        }}
                      >
                        {product.name}
                      </h3>

                      <p
                        style={{
                          margin: "0 0 6px",
                          fontSize: "16px",
                          color: "#2e3d4c",
                        }}
                      >
                        Sold: {product.quantity}
                      </p>

                      <p
                        style={{
                          margin: "0 0 10px",
                          fontSize: "18px",
                          color: "#2e3d4c",
                        }}
                      >
                        ${Number(product.price || 0).toFixed(2)}
                      </p>

                      <button
                        style={{
                          background: "#8f4bd8",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          padding: "8px 14px",
                          fontFamily: "Josefin Sans, sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#2e3d4c" }}>No top products yet.</p>
                )}
              </div>
            </div>

            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Activity</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "170px 1fr",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div style={{ width: "100%", height: "180px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityData}
                        dataKey="value"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={2}
                      >
                        {activityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {activityData.map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: item.color,
                            display: "inline-block",
                          }}
                        />

                        <span style={{ color: "#2e3d4c", fontSize: "16px" }}>
                          {item.name}
                        </span>
                      </div>

                      <span style={{ color: "#2e3d4c", fontSize: "14px" }}>
                        {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1100px) {
            .admin-dashboard-layout {
              grid-template-columns: 1fr !important;
            }

            .admin-top-cards,
            .admin-middle-grid,
            .admin-bottom-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function StatCard({ title, value, change, changeColor }) {
  return (
    <div style={statCardStyle}>
      <p style={{ margin: "0 0 8px", color: "#3c4352", fontSize: "16px" }}>
        {title}
      </p>

      <h3
        style={{
          margin: "0 0 8px",
          color: "#222",
          fontSize: "34px",
          fontWeight: "700",
        }}
      >
        {value}
      </h3>

      {change && (
        <p style={{ margin: 0, color: changeColor || "#3ea85b", fontSize: "13px" }}>
          {change}
        </p>
      )}
    </div>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "28px",
  backdropFilter: "blur(14px)",
  padding: "14px 16px 16px",
  boxSizing: "border-box",
};

const panelTitleStyle = {
  margin: "0 0 8px",
  fontSize: "24px",
  color: "#2e3d4c",
  fontWeight: "700",
};

const statCardStyle = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "24px",
  backdropFilter: "blur(14px)",
  padding: "14px 18px",
};

const selectStyle = {
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.12)",
  padding: "4px 8px",
  fontFamily: "Josefin Sans, sans-serif",
};

const thStyle = {
  padding: "12px 10px",
  textAlign: "left",
  color: "#3c4352",
  fontSize: "13px",
};

const tdStyle = {
  padding: "14px 10px",
  color: "#2e3d4c",
  fontSize: "13px",
  borderTop: "1px solid rgba(0,0,0,0.05)",
};

const statusStyle = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: "600",
};

const emptyCellStyle = {
  padding: "18px 10px",
  textAlign: "center",
  color: "#4b5563",
};

export default AdminDashboard;