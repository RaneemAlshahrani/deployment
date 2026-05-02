// frontend/src/components/AdminSidebar.jsx
import { useNavigate } from "react-router-dom";
import logo from "../assets/bubble-logo.png";

function AdminSidebar({ activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="logo-card">
        <img src={logo} alt="Bubble Logo" />
      </div>

      <button
        className={activePage === "dashboard" ? "active" : ""}
        onClick={() => navigate("/admin-dashboard")}
      >
        Dashboard
      </button>

      <button
        className={activePage === "products" ? "active" : ""}
        onClick={() => navigate("/admin/products")}
      >
        Product Management
      </button>

      <button
        className={activePage === "inventory" ? "active" : ""}
        onClick={() => navigate("/admin/inventory")}
      >
        Inventory Management
      </button>

      <button
        className={activePage === "promotions" ? "active" : ""}
        onClick={() => navigate("/admin/promotions")}
      >
        Promotions Management
      </button>

      <button
        className={activePage === "orders" ? "active" : ""}
        onClick={() => navigate("/admin/orders")}
      >
        Order Management
      </button>

      <button
        className={activePage === "reviews" ? "active" : ""}
        onClick={() => navigate("/admin/reviews")}
      >
        Review Management
      </button>

      <div className="spacer" />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminSidebar;