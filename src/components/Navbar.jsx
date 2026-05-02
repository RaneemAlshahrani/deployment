import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/api";
import logo from "../assets/bubble-logo.png";
import cart from "../assets/cart.png";
import profile from "../assets/profile-picture.png";

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

useEffect(() => {
  const media = window.matchMedia("(max-width: 768px)");

  const handleChange = () => {
    setIsMobile(media.matches);
    if (!media.matches) setMenuOpen(false);
  };

  handleChange(); // 🔥 important (runs on first load)
  media.addEventListener("change", handleChange);

  return () => media.removeEventListener("change", handleChange);
}, []);

  const links = [
    { name: "Home", path: "/home" },
    { name: "Products", path: "/products" },
    { name: "Contact Us", path: "/contact" },
  ];

  if (currentUser?.role === "admin") {
    links.push({ name: "Admin", path: "/admin-dashboard" });
  } else if (currentUser?.role === "customer-service") {
    links.push({ name: "Support", path: "/customer-service/tickets" });
  }

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          padding: "clamp(6px, 2vw, 10px) clamp(10px, 3vw, 22px)",
          margin: "clamp(6px, 2vw, 16px) auto",

          maxWidth: "1000px",
          width: "90%",

          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",

          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "clamp(16px, 4vw, 30px)",

          backdropFilter: "blur(12px)",
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="Bubble Logo"
          style={{
            width: "clamp(55px, 12vw, 95px)", // ✅ smaller
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
        />

        {/* Desktop links */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "30px",
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                style={({ isActive }) => ({
                  cursor: "pointer",
                  color: isActive ? "#fff" : "#333",
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: isActive ? "underline" : "none",
                  transition: "all 0.3s ease",
                  fontSize: "15px",
                })}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px" }}>
          
          {/* Mobile menu icon */}
          {isMobile && (
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                fontSize: "20px", // ✅ smaller
                cursor: "pointer",
                color: "#333",
              }}
            >
              ☰
            </div>
          )}

          {/* Cart */}
          <img
            src={cart}
            alt="Cart"
            onClick={() => navigate("/cart")}
            style={{
              width: "clamp(16px, 4vw, 24px)", // ✅ smaller
              cursor: "pointer",
            }}
          />

          {/* Profile */}
          <img
            src={profile}
            alt="Profile"
            onClick={() => navigate("/profile")}
            style={{
              width: "clamp(22px, 6vw, 34px)",
              height: "clamp(22px, 6vw, 34px)",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              padding: "clamp(5px, 1.5vw, 10px) clamp(10px, 3vw, 24px)",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              color: "#3b3b3b",
              fontSize: isMobile ? "12px" : "16px", // ✅ smaller text
              fontFamily: "Josefin Sans, sans-serif",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.16)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.08)";
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px", // ✅ adjusted with smaller navbar
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            textAlign: "center",
            zIndex: 99,
          }}
        >
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                cursor: "pointer",
                color: isActive ? "#fff" : "#2e3d4c",
                fontWeight: isActive ? 700 : 400,
                textDecoration: "none",
                fontSize: "14px",
              })}
            >
              {link.name}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.08)",
              color: "#3b3b3b",
              fontSize: "13px",
              fontFamily: "Josefin Sans, sans-serif",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;