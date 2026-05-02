import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import soap from "../assets/soap-bliss.png";
import bubble8 from "../assets/bubble8.png";
import { getCurrentUserId, getCurrentUser, getAuthToken } from "../utils/auth";

function Checkout() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  const userId = getCurrentUserId();

  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });

  const [formError, setFormError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

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
            setForm({
              fullName: userData.user.fullName || "",
              email: userData.user.email || "",
              phone: userData.user.phone || "",
              location: userData.user.address || "",
            });
          } else {
            const savedProfile =
              JSON.parse(localStorage.getItem("checkoutProfile")) ||
              JSON.parse(localStorage.getItem("profileData")) || {
                fullName: currentUser.fullName || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
                location: currentUser.address || "",
              };
            setForm(savedProfile);
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          const savedProfile =
            JSON.parse(localStorage.getItem("checkoutProfile")) ||
            JSON.parse(localStorage.getItem("profileData")) || {
              fullName: currentUser.fullName || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              location: currentUser.address || "",
            };
          setForm(savedProfile);
        }
      } else {
        const savedProfile =
          JSON.parse(localStorage.getItem("checkoutProfile")) ||
          JSON.parse(localStorage.getItem("profileData")) || {
            fullName: "",
            email: "",
            phone: "",
            location: "",
          };
        setForm(savedProfile);
      }
      setLoading(false);
    };

    loadProfileData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const data = await response.json();

        const formattedCart = data.map((item) => {
          const product = item.productId;

          return {
            _id: item._id,
            productId: product?._id,
            name: product?.name || "Unknown Product",
            price: product?.price || 0,
            image: product?.image?.startsWith("http") ? product.image : soap,
            stock: product?.stock || 0,
            quantity: item.quantity,
            customOptions: item.customOptions,
          };
        });

        setCartItems(formattedCart);
      } catch (error) {
        console.error("Failed to fetch checkout cart:", error);
      }
    };

    fetchCart();
  }, [userId]);

  const cartWithDetails = cartItems;

  const subtotal = cartWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = Math.max(subtotal - discountAmount, 0);

  const handleDiscountApply = async () => {
    setDiscountMessage("");
    setDiscountError("");

    const code = discountCode.trim().toLowerCase();

    if (!code) {
      setDiscountError("Invalid discount code");
      setDiscountAmount(0);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/promotions");
      const promos = await response.json();

      const promo = promos.find(
        (p) => String(p.code).trim().toLowerCase() === code
      );

      if (!promo) {
        setDiscountError("Invalid discount code");
        setDiscountAmount(0);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiryDate = new Date(promo.expiry);
      expiryDate.setHours(0, 0, 0, 0);

      if (expiryDate < today || promo.active === false) {
        setDiscountError("Promo code expired");
        setDiscountAmount(0);
        return;
      }

      const percent = Number(promo.value);

      if (Number.isNaN(percent) || percent <= 0) {
        setDiscountError("Invalid discount value");
        setDiscountAmount(0);
        return;
      }

      const amount = subtotal * (percent / 100);

      setDiscountAmount(amount);
      setDiscountMessage("Discount applied successfully");
    } catch (error) {
      console.error(error);
      setDiscountError("Failed to apply discount");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Don't allow email to be changed
    if (name === "email") return;
    
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaveMessage("");
    setFormError("");
    setOrderError("");

    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;

      if (value && !phoneRegex.test(value)) {
        setPhoneError("Invalid phone number");
      } else {
        setPhoneError("");
      }
    }
  };

  const getLocation = () => {
    setSaveMessage("");
    setFormError("");

    if (!navigator.geolocation) {
      setFormError("Location is not supported on this device");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationValue = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        setForm((prev) => ({
          ...prev,
          location: locationValue,
        }));

        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setFormError("Unable to retrieve location");
      }
    );
  };

  const handleSave = () => {
    setSaveMessage("");
    setFormError("");
    setPhoneError("");

    if (!form.fullName || !form.email || !form.phone || !form.location) {
      setFormError("Please fill all shipping information");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setPhoneError("Invalid phone number");
      return;
    }

    localStorage.setItem("checkoutProfile", JSON.stringify(form));
    localStorage.setItem("profileData", JSON.stringify(form));
    setSaveMessage("Saved!");
  };

  const clearCartAfterOrder = async () => {
    await Promise.all(
      cartWithDetails.map((item) =>
        fetch(`http://localhost:5000/api/cart/${item._id}`, {
          method: "DELETE",
        })
      )
    );
  };

  const handlePayConfirm = async () => {
    setOrderMessage("");
    setOrderError("");
    setFormError("");
    setPhoneError("");

    if (!userId) {
      setOrderError("Please login first");
      return;
    }

    if (cartWithDetails.length === 0) {
      setOrderError("Cart is empty");
      return;
    }

    if (!form.fullName || !form.email || !form.phone || !form.location) {
      setFormError("Please fill all shipping information");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setPhoneError("Invalid phone number");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items: cartWithDetails.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            customization: item.customOptions,
          })),
          totalPrice: total,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      await clearCartAfterOrder();

      localStorage.setItem("checkoutProfile", JSON.stringify(form));
      localStorage.setItem("profileData", JSON.stringify(form));

      setCartItems([]);
      setDiscountCode("");
      setDiscountAmount(0);
      setDiscountMessage("");
      setDiscountError("");
      setOrderMessage("Order placed successfully");
    } catch (error) {
      console.error(error);
      setOrderError("Failed to place order");
    }
  };

  if (loading) {
    return (
      <div className="purple-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>Loading your information...</div>
      </div>
    );
  }

  return (
    <div
      className="purple-page"
      style={{
        minHeight: "100vh",
        padding: isMobile ? "20px 14px 30px" : "46px 40px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={bubble8}
        alt="bubble"
        style={{
          position: "absolute",
          left: isMobile ? "-80px" : "-30px",
          top: isMobile ? "120px" : "20px",
          width: isMobile ? "220px" : "320px",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: isMobile ? "12px 22px" : "14px 30px",
          borderRadius: "26px",
          border: "1px solid rgba(255,255,255,0.35)",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(12px)",
          color: "#3b3b3b",
          fontSize: isMobile ? "15px" : "16px",
          fontFamily: "Josefin Sans, sans-serif",
          cursor: "pointer",
          marginBottom: "18px",
          position: "relative",
          zIndex: 2,
        }}
      >
        ← Back
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "18px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "235px",
            minWidth: isMobile ? "100%" : "235px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "28px",
            padding: "18px 16px",
            backdropFilter: "blur(14px)",
            boxSizing: "border-box",
            alignSelf: isMobile ? "stretch" : "flex-start",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "10px",
              fontSize: isMobile ? "24px" : "22px",
              color: "#333",
            }}
          >
            Order Summary
          </h2>

          <p style={{ margin: "0 0 8px 0", color: "#444", fontSize: "14px" }}>
            Discount
          </p>

          <input
            type="text"
            placeholder="Discount Code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={inputStyle}
          />

          <Button
            text="Apply"
            variant="purple"
            style={{
              width: "100%",
              marginTop: "10px",
              marginBottom: "8px",
            }}
            onClick={handleDiscountApply}
          />

          {discountMessage && (
            <p style={{ ...successStyle, marginBottom: "4px" }}>
              {discountMessage}
            </p>
          )}

          {discountError && (
            <p style={{ ...errorStyle, marginBottom: "10px" }}>
              {discountError}
            </p>
          )}

          <div style={summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div style={summaryRow}>
              <span>Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div style={summaryRow}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={glassBox}>
            <h1
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: isMobile ? "28px" : "30px",
                color: "#333",
              }}
            >
              Checkout
            </h1>

            <div style={tableWrapper}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeadRow}>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Quantity</th>
                    <th style={thStyle}>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {cartWithDetails.length > 0 ? (
                    cartWithDetails.map((item) => (
                      <tr key={item._id}>
                        <td style={tdStyle}>
                          <div style={productCell}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={productImageStyle}
                            />
                            <div>
                              <span>{item.name}</span>

                              {item.customOptions && (
                                <div style={customDetailsBox}>
                                  {item.customOptions.scents?.length > 0 && (
                                    <div>
                                      <strong>Scent:</strong>{" "}
                                      {item.customOptions.scents.join(", ")}
                                    </div>
                                  )}

                                  {item.customOptions.texture && (
                                    <div>
                                      <strong>Texture:</strong>{" "}
                                      {item.customOptions.texture}
                                    </div>
                                  )}

                                  {item.customOptions.ingredients?.length >
                                    0 && (
                                    <div>
                                      <strong>Ingredients:</strong>{" "}
                                      {item.customOptions.ingredients.join(", ")}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td style={tdStyle}>${item.price.toFixed(2)}</td>
                        <td style={tdStyle}>{item.quantity}</td>
                        <td style={tdStyle}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={tdStyle}>
                        Your cart is empty
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={glassBox}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? "28px" : "30px",
                  color: "#333",
                }}
              >
                Profile Information
              </h2>

              {formError && <p style={{ ...errorStyle, margin: 0 }}>{formError}</p>}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "22px 28px",
              }}
            >
              {/* Full Name - Editable */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Username"
                  value={form.fullName}
                  onChange={handleChange}
                  style={inputStyleWide}
                />
              </div>

              {/* Email - Read Only (NOT Editable) */}
              <div>
                <label style={labelStyle}>Email</label>
                <div
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#f5f5f5",
                    fontSize: "14px",
                    fontFamily: "Josefin Sans, sans-serif",
                    boxSizing: "border-box",
                    color: "#666",
                    cursor: "not-allowed",
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                  }}
                >
                  {form.email || "No email set"}
                </div>
              </div>

              {/* Phone Number - Editable */}
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="1231231231"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyleWide}
                />
                {phoneError && (
                  <p style={{ ...errorStyle, marginTop: "6px" }}>{phoneError}</p>
                )}
              </div>

              {/* Location - Editable with GPS */}
              <div>
                <label style={labelStyle}>Location</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    name="location"
                    placeholder="Tap location icon"
                    value={form.location}
                    onChange={handleChange}
                    style={{ ...inputStyleWide, paddingRight: "42px" }}
                  />
                  <span
                    onClick={getLocation}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#555",
                      fontSize: "18px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    title="Use current location"
                  >
                    📍
                  </span>
                </div>

                {locationLoading && (
                  <p style={{ ...successStyle, marginTop: "6px" }}>
                    Getting location...
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: "22px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Button
                text="Save"
                variant="purple"
                style={{ width: "120px" }}
                onClick={handleSave}
              />

              {saveMessage && (
                <p style={{ ...successStyle, margin: 0 }}>{saveMessage}</p>
              )}
            </div>

            <div
              style={{
                marginTop: "28px",
                display: "flex",
                alignItems: "center",
                gap: "18px",
                flexWrap: "wrap",
              }}
            >
              <Button
                text="Pay & Confirm"
                variant="purple"
                style={{ width: "170px" }}
                onClick={handlePayConfirm}
              />

              {orderMessage && (
                <p style={{ ...successStyle, margin: 0 }}>{orderMessage}</p>
              )}

              {orderError && <p style={{ ...errorStyle, margin: 0 }}>{orderError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const glassBox = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "28px",
  padding: "18px",
  backdropFilter: "blur(14px)",
  boxSizing: "border-box",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #777",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.92)",
};

const inputStyleWide = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #777",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.92)",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#444",
  fontSize: "15px",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  color: "#444",
  fontWeight: "500",
};

const tableWrapper = {
  overflowX: "auto",
  borderRadius: "14px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "540px",
  background: "rgba(255,255,255,0.22)",
  borderRadius: "14px",
  overflow: "hidden",
};

const tableHeadRow = {
  background: "rgba(255,255,255,0.45)",
};

const thStyle = {
  padding: "14px 12px",
  textAlign: "center",
  fontWeight: "600",
  color: "#333",
  fontSize: "15px",
};

const tdStyle = {
  padding: "14px 12px",
  textAlign: "center",
  color: "#444",
  borderTop: "1px solid rgba(0,0,0,0.06)",
  fontSize: "14px",
  verticalAlign: "middle",
};

const productCell = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const productImageStyle = {
  width: "56px",
  height: "56px",
  objectFit: "contain",
};

const successStyle = {
  color: "#39a86f",
  fontSize: "14px",
  fontWeight: "500",
};

const errorStyle = {
  color: "#ff3d2e",
  fontSize: "13px",
  fontWeight: "500",
};

const customDetailsBox = {
  marginTop: "6px",
  padding: "6px 8px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.35)",
  color: "#555",
  fontSize: "12px",
  lineHeight: "1.5",
  textAlign: "left",
  maxWidth: "230px",
};

export default Checkout;