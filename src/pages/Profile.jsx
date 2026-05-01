// src/pages/Profile.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";
import defaultProfileImage from "../assets/Profile .png";
import billingCard from "../assets/Card.png";
import { getCurrentUser, getAuthToken, updateUserProfile } from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [imageMessage, setImageMessage] = useState("");
  const [savedImage, setSavedImage] = useState(() => {
    return localStorage.getItem("profileImage") || defaultProfileImage;
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getAuthToken();
      const currentUser = getCurrentUser();
      
      if (!token || !currentUser) {
        navigate("/");
        return;
      }
      
      try {
        // Fetch user profile from backend
        const response = await fetch(`http://localhost:5000/api/auth/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setFormData({
            fullName: userData.user.fullName || "",
            email: userData.user.email || "",
            phone: userData.user.phone || "",
            address: userData.user.address || "",
          });
        } else {
          // Fallback to stored user data
          setUser(currentUser);
          setFormData({
            fullName: currentUser.fullName || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            address: currentUser.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        // Fallback to stored user data
        setUser(currentUser);
        setFormData({
          fullName: currentUser.fullName || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
    
    // Fetch orders
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, [navigate]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setSavedMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone must contain only numbers";
    }

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSavedMessage("");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("Please login again");
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser.user));
        setSavedMessage("Profile updated successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSavedMessage(""), 3000);
      } else {
        const error = await response.json();
        setSavedMessage(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSavedMessage("Error updating profile");
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageMessage("Please choose a valid image file.");
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setImageMessage("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setSavedImage(result);
      localStorage.setItem("profileImage", result);
      setImageMessage("Profile picture updated.");
      setSavedMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSavedImage(defaultProfileImage);
    localStorage.removeItem("profileImage");
    setImageMessage("Profile picture removed.");
    setSavedMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUsername = formData.fullName
    ? `@${formData.fullName.replace(/\s+/g, "")}`
    : "@Username";

  if (loading) {
    return (
      <div className="purple-page" style={{ minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", paddingTop: "200px" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="purple-page" style={{ minHeight: "100vh" }}>
      <Navbar />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "110px",
          paddingBottom: "40px",
          width: "90%",
          maxWidth: "1260px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "18px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(10px)",
              borderRadius: "30px",
              padding: "14px 28px",
              fontFamily: "Josefin Sans, sans-serif",
              fontSize: "18px",
              color: "#2e3d4c",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            ← Back
          </button>
        </div>

        <div
          className="profile-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: "22px",
            alignItems: "start",
          }}
        >
          {/* Left Sidebar - Profile Picture */}
          <div
            style={{
              background: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: "28px",
              padding: "34px 20px 18px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              minHeight: "580px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "170px",
                  height: "170px",
                  margin: "0 auto 18px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.25)",
                }}
              >
                <img
                  src={savedImage}
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
                  fontSize: "34px",
                  color: "#334155",
                  margin: "0 0 10px",
                  fontWeight: "600",
                  wordBreak: "break-word",
                }}
              >
                {displayUsername}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#4b5563",
                  fontSize: "15px",
                  wordBreak: "break-word",
                }}
              >
                {formData.email}
              </p>
            </div>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <button
                onClick={handleUploadClick}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: "14px",
                  padding: "10px 14px",
                  textAlign: "left",
                  fontFamily: "Josefin Sans, sans-serif",
                  color: "#5b6470",
                  cursor: "pointer",
                }}
              >
                ↻ Upload Profile Picture
              </button>

              <button
                onClick={handleRemoveImage}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: "14px",
                  padding: "10px 14px",
                  textAlign: "left",
                  fontFamily: "Josefin Sans, sans-serif",
                  color: "#5b6470",
                  cursor: "pointer",
                }}
              >
                ✕ Remove Profile Picture
              </button>

              {imageMessage && (
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#ff4d6d",
                    fontSize: "13px",
                  }}
                >
                  {imageMessage}
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Profile Form */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "22px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: "28px",
                padding: "28px 32px 34px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
            >
              <h1
                style={{
                  margin: "0 0 22px",
                  fontSize: "28px",
                  color: "#2e3d4c",
                  fontWeight: "700",
                }}
              >
                Profile Information
              </h1>

              <div
                className="profile-form-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px 28px",
                }}
              >
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginTop: "26px",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  text="Save Changes"
                  variant="secondary"
                  onClick={handleSave}
                />

                {savedMessage && (
                  <span
                    style={{
                      color: savedMessage.includes("success") ? "#39a86f" : "#ff4d6d",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {savedMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Orders Section */}
            <div
              className="profile-bottom-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 0.9fr",
                gap: "22px",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.16)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: "28px",
                  padding: "26px 32px 20px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 18px",
                    fontSize: "26px",
                    color: "#2e3d4c",
                    fontWeight: "700",
                  }}
                >
                  Recent Orders
                </h2>

                <div
                  style={{
                    overflowX: "auto",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.35)",
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
                          background: "rgba(255,255,255,0.55)",
                          color: "#4b5563",
                          textAlign: "left",
                        }}
                      >
                        <th style={{ padding: "14px 10px", fontSize: "14px" }}>
                          Order ID.
                        </th>
                        <th style={{ padding: "14px 10px", fontSize: "14px" }}>
                          Date
                        </th>
                        <th style={{ padding: "14px 10px", fontSize: "14px" }}>
                          Item
                        </th>
                        <th style={{ padding: "14px 10px", fontSize: "14px" }}>
                          Total
                        </th>
                        <th style={{ padding: "14px 10px", fontSize: "14px" }}>
                          Status
                        </th>
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
                                ${(order.total || order.subtotal || 0).toFixed(2)}
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

                <div style={{ marginTop: "16px" }}>
                  <Button
                    text="My Orders"
                    variant="secondary"
                    onClick={() => navigate("/order-history")}
                  />
                </div>
              </div>

              {/* Billing Card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.16)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: "28px",
                  padding: "26px 26px 20px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "26px",
                      color: "#2e3d4c",
                      fontWeight: "700",
                    }}
                  >
                    Billing Information
                  </h2>
                </div>

                <img
                  src={billingCard}
                  alt="Billing Card"
                  style={{
                    width: "100%",
                    borderRadius: "18px",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1100px) {
            .profile-main-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 980px) {
            .profile-form-grid,
            .profile-bottom-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Profile;