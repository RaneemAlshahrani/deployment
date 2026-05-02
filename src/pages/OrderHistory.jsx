import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/Profile .png";
import { getCurrentUser, getAuthToken } from "../utils/auth";

function OrderHistory() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });
  const [profileImageSrc, setProfileImageSrc] = useState(() => {
    return localStorage.getItem("profileImage") || profileImage;
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load profile data from backend
  useEffect(() => {
    const loadProfileData = async () => {
      const token = getAuthToken();
      const currentUser = getCurrentUser();
      
      if (token && currentUser) {
        try {
          const response = await fetch(`http://localhost:5000/api/auth/profile`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setProfileData({
              fullName: userData.user.fullName || "User",
              email: userData.user.email || "user@example.com",
            });
          } else {
            setProfileData({
              fullName: currentUser.fullName || "User",
              email: currentUser.email || "user@example.com",
            });
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          setProfileData({
            fullName: currentUser.fullName || "User",
            email: currentUser.email || "user@example.com",
          });
        }
      } else if (currentUser) {
        setProfileData({
          fullName: currentUser.fullName || "User",
          email: currentUser.email || "user@example.com",
        });
      }
      setLoading(false);
    };

    loadProfileData();
  }, []);

  // Load orders from localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const displayUsername = profileData.fullName
    ? `@${profileData.fullName.replace(/\s+/g, "")}`
    : "@User";

  if (loading) {
    return (
      <div className="purple-page" style={{ minHeight: "100vh" }}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "92%",
            maxWidth: "1280px",
            margin: "0 auto",
            paddingTop: "24px",
            paddingBottom: "30px",
            textAlign: "center",
            paddingTop: "200px",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="purple-page" style={{ minHeight: "100vh" }}>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "92%",
          maxWidth: "1280px",
          margin: "0 auto",
          paddingTop: "24px",
          paddingBottom: "30px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.28)",
            borderRadius: "30px",
            padding: "16px 34px",
            fontFamily: "Josefin Sans, sans-serif",
            fontSize: "18px",
            color: "#2e3d4c",
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            marginBottom: "10px",
          }}
        >
          ← Back
        </button>

        <div
          className="order-history-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "230px 1fr",
            gap: "34px",
            alignItems: "start",
          }}
        >
          {/* Profile Sidebar */}
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: "28px",
              padding: "30px 18px 20px",
              backdropFilter: "blur(14px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              textAlign: "center",
              minHeight: "230px",
            }}
          >
            <div
              style={{
                width: "132px",
                height: "132px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 18px",
                background: "rgba(255,255,255,0.24)",
              }}
            >
              <img
                src={profileImageSrc}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#334155",
                fontSize: "22px",
                fontWeight: "600",
                wordBreak: "break-word",
              }}
            >
              {displayUsername}
            </h2>

            {/* Email - Display as text, NOT editable */}
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(255,255,255,0.2)",
                fontSize: "13px",
                color: "#4b5563",
                wordBreak: "break-all",
              }}
            >
              {profileData.email}
            </div>
          </div>

          {/* Orders Section */}
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: "28px",
              padding: "32px",
              backdropFilter: "blur(14px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              minHeight: "540px",
            }}
          >
            <h1
              style={{
                margin: "0 0 22px",
                fontSize: "28px",
                color: "#111827",
                fontWeight: "700",
              }}
            >
              Order History
            </h1>

            <div
              style={{
                width: "100%",
                maxWidth: "720px",
                overflowX: "auto",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.34)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "620px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "rgba(255,255,255,0.52)",
                      color: "#4b5563",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "14px 10px", fontSize: "14px" }}>Order ID.</th>
                    <th style={{ padding: "14px 10px", fontSize: "14px" }}>Date</th>
                    <th style={{ padding: "14px 10px", fontSize: "14px" }}>Item</th>
                    <th style={{ padding: "14px 10px", fontSize: "14px" }}>Total</th>
                    <th style={{ padding: "14px 10px", fontSize: "14px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => {
                      const itemNames =
                        order.items && order.items.length > 0
                          ? order.items.map((item) => item.item).join(", ")
                          : order.item || order.name || "Unknown Item";

                      return (
                        <tr
                          key={order.id || index}
                          style={{
                            borderTop: "1px solid rgba(255,255,255,0.35)",
                          }}
                        >
                          <td style={{ padding: "18px 10px", color: "#374151" }}>
                            {order.id || `#${1000 + index}`}
                          </td>

                          <td style={{ padding: "18px 10px", color: "#374151" }}>
                            {formatDate(order.date)}
                          </td>

                          <td style={{ padding: "18px 10px", color: "#374151" }}>
                            {itemNames}
                          </td>

                          <td style={{ padding: "18px 10px", color: "#374151" }}>
                            {`$${(
                              typeof order.total === "number"
                                ? order.total
                                : typeof order.subtotal === "number"
                                ? order.subtotal
                                : !Number.isNaN(Number(order.total))
                                ? Number(order.total)
                                : !Number.isNaN(Number(order.subtotal))
                                ? Number(order.subtotal)
                                : 0
                            ).toFixed(2)}`}
                          </td>

                          <td style={{ padding: "18px 10px" }}>
                            <span
                              style={{
                                background: "#b99af1",
                                color: "#5b2fb2",
                                padding: "6px 12px",
                                borderRadius: "10px",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          padding: "24px 10px",
                          textAlign: "center",
                          color: "#4b5563",
                        }}
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 900px) {
            .order-history-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default OrderHistory;