import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import rose from "../assets/rose.png";
import lavender from "../assets/lavender.png";
import bubble8 from "../assets/bubble8.png";
import rosemary from "../assets/rosemary.png";
import soap from "../assets/soap-bliss.png";

function Cart() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = !!currentUser;

  const allProducts = [
    {
      id: 1,
      name: "Sakura Bliss",
      price: 30,
      image: rose,
      description: "A soft floral soap inspired by sakura blossoms.",
      ingredients: "Sakura, Oil, Milk, Other stuff",
      inStock: true,
      stock: 10,
      theme: "pink",
      reviews: ["So soft on the skin!", "Smells lovely 🌸"],
    },
    {
      id: 2,
      name: "Lavender Bliss",
      price: 30,
      image: lavender,
      description: "A calming lavender soap for a relaxing routine.",
      ingredients: "Lavender, Oil, Milk, Other stuff",
      inStock: false,
      stock: 0,
      theme: "purple",
      reviews: ["Smells amazing!", "Would buy again 💜"],
    },
    {
      id: 3,
      name: "Rosemary Bliss",
      price: 50,
      image: rosemary,
      description: "A refreshing rosemary soap that energizes your skin.",
      ingredients: "Rosemary, Oil, Milk, Other stuff",
      inStock: true,
      stock: 10,
      theme: "green",
      reviews: ["Very refreshing 🌿", "Love the scent!"],
    },
    {
      id: 4,
      name: "Soap Bliss",
      price: 7,
      image: soap,
      inStock: true,
      stock: 10,
    },
  ];

  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cart/testUser");
        const data = await response.json();

        setCartItems(
          data.map((item) => ({
            _id: item._id,
            name: item.productId?.name,
            price: item.productId?.price,
            image: `/images/${item.productId?.image}`,
            stock: item.productId?.stock,
            quantity: item.quantity,
            error: "",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();

    const storedWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    setWishlistItems(storedWishlist);
  }, []);

  const wishlistWithDetails = wishlistItems
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.id);
      if (!product) return null;

      return {
        ...item,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        inStock: product.inStock,
      };
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = Math.max(subtotal - discountAmount, 0);

  const handleDiscountApply = () => {
    setDiscountMessage("");
    setDiscountError("");

    const code = discountCode.trim().toLowerCase();

    if (!code) {
      setDiscountError("Please enter a discount code");
      setDiscountAmount(0);
      return;
    }

    const storedPromos =
      JSON.parse(localStorage.getItem("promoCodes")) || [];

    const promo = storedPromos.find((p) => p.code === code);

    if (!promo) {
      setDiscountError("Invalid discount code");
      setDiscountAmount(0);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(promo.expiry);
    expiryDate.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      setDiscountError("Promo code expired");
      setDiscountAmount(0);
      return;
    }

    const percent = parseFloat(String(promo.value).replace("%", ""));

    if (isNaN(percent) || percent <= 0) {
      setDiscountError("Invalid discount value");
      setDiscountAmount(0);
      return;
    }

    const amount = subtotal * (percent / 100);

    setDiscountAmount(amount);
    setDiscountMessage("Discount applied successfully");
  };

  const updateCartQuantity = async (itemToUpdate, change) => {
    setCartMessage("");

    const newQuantity = itemToUpdate.quantity + change;

    if (newQuantity < 1) return;
    if (newQuantity > itemToUpdate.stock) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${itemToUpdate._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemToUpdate._id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateWishlistQuantity = (id, change) => {
    const updatedWishlist = wishlistItems.map((item) => {
      if (item.id !== id) return item;

      const product = allProducts.find((p) => p.id === id);
      const stock = product?.stock ?? 0;
      const newQuantity = item.quantity + change;

      if (newQuantity < 1) {
        return {
          ...item,
          quantity: 1,
        };
      }

      if (stock === 0) {
        return item;
      }

      if (newQuantity > stock) {
        return item;
      }

      return {
        ...item,
        quantity: newQuantity,
      };
    });

    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
  };

  const removeCartItem = async (itemToRemove) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${itemToRemove._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      setCartItems((prev) =>
        prev.filter((item) => item._id !== itemToRemove._id)
      );

      setCartMessage("Product removed successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const removeWishlistItem = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    setCartMessage("Product removed successfully");
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    navigate("/checkout");
  };

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
            width: isMobile ? "100%" : "220px",
            minWidth: isMobile ? "100%" : "220px",
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
              marginBottom: "14px",
              fontSize: isMobile ? "24px" : "22px",
              color: "#333",
            }}
          >
            Order Summary
          </h2>

          <p
            style={{
              margin: "0 0 8px 0",
              color: "#444",
              fontSize: "14px",
            }}
          >
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
              marginBottom: "12px",
            }}
            onClick={handleDiscountApply}
          />

          {discountMessage && (
            <p style={{ ...successStyle, marginBottom: "6px" }}>
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

          <div style={summaryRow}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: "16px" }}>
            <Button
              text="Checkout"
              variant="purple"
              style={{ width: "100%" }}
              onClick={handleCheckout}
            />
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={glassBox}>
            <h1
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: isMobile ? "28px" : "30px",
                color: "#333",
              }}
            >
              Cart
            </h1>

            <div style={tableWrapper}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeadRow}>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Quantity</th>
                    <th style={thStyle}>Subtotal</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <tr key={item._id}>
                        <td style={tdStyle}>
                          <div style={productCell}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={productImageStyle}
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>

                        <td style={tdStyle}>${item.price.toFixed(2)}</td>

                        <td style={tdStyle}>
                          <div style={qtyBox}>
                            <button
                              onClick={() => updateCartQuantity(item, -1)}
                              style={qtyBtn}
                            >
                              −
                            </button>

                            <span style={qtyValue}>{item.quantity}</span>

                            <button
                              onClick={() => updateCartQuantity(item, 1)}
                              style={qtyBtn}
                            >
                              +
                            </button>
                          </div>

                          {item.error && <p style={errorStyle}>{item.error}</p>}
                        </td>

                        <td style={tdStyle}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() => removeCartItem(item)}
                            style={trashBtn}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={tdStyle}>
                        Your cart is empty
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {cartMessage && (
              <p style={{ ...successStyle, marginTop: "12px" }}>{cartMessage}</p>
            )}
          </div>

          <div style={glassBox}>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: isMobile ? "28px" : "30px",
                color: "#333",
              }}
            >
              Wishlist
            </h2>

            <div style={tableWrapper}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeadRow}>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Quantity</th>
                    <th style={thStyle}>Subtotal</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {wishlistWithDetails.length > 0 ? (
                    wishlistWithDetails.map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}>
                          <div style={productCell}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={productImageStyle}
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>

                        <td style={tdStyle}>
                          {item.stock > 0
                            ? `$${item.price.toFixed(2)}`
                            : "Out Of Stock"}
                        </td>

                        <td style={tdStyle}>
                          <div style={qtyBox}>
                            <button
                              onClick={() => updateWishlistQuantity(item.id, -1)}
                              style={qtyBtn}
                              disabled={item.stock === 0}
                            >
                              −
                            </button>

                            <span style={qtyValue}>{item.quantity}</span>

                            <button
                              onClick={() => updateWishlistQuantity(item.id, 1)}
                              style={qtyBtn}
                              disabled={item.stock === 0}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td style={tdStyle}>
                          {item.stock > 0
                            ? `$${(item.price * item.quantity).toFixed(2)}`
                            : "Out Of Stock"}
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() => removeWishlistItem(item.id)}
                            style={trashBtn}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={tdStyle}>
                        Your wishlist is empty
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
  border: "1px solid #b9b9b9",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
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
  minWidth: "620px",
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
  gap: "10px",
};

const productImageStyle = {
  width: "74px",
  height: "74px",
  objectFit: "contain",
};

const qtyBox = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
};

const qtyBtn = {
  width: "24px",
  height: "24px",
  borderRadius: "4px",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.65)",
  cursor: "pointer",
};

const qtyValue = {
  minWidth: "18px",
  display: "inline-block",
  textAlign: "center",
};

const trashBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "18px",
};

const successStyle = {
  color: "#39a86f",
  fontSize: "14px",
  fontWeight: "500",
  margin: 0,
};

const errorStyle = {
  color: "#ff5a45",
  fontSize: "13px",
  marginTop: "6px",
  marginBottom: 0,
};

export default Cart;