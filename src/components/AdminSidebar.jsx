import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/bubble-logo.png";

function AdminNavbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");

    const handleChange = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMenuOpen(false);
    };

    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const links = [
    { name: "Dashboard", path: "/admin-dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Inventory", path: "/admin/inventory" },
    { name: "Promotions", path: "/admin/promotions" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Reviews", path: "/admin/reviews" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "clamp(6px, 2vw, 10px) clamp(10px, 3vw, 22px)",
          margin: "clamp(6px, 2vw, 20px) auto",
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
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "clamp(55px, 12vw, 95px)",
            cursor: "pointer",
          }}
          onClick={() => navigate("/admin-dashboard")}
        />

        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "25px",
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                style={({ isActive }) => ({
                  color: isActive ? "#fff" : "#333",
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: isActive ? "underline" : "none",
                  fontSize: "15px",
                })}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isMobile && (
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color: "#333",
              }}
            >
              ☰
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              padding: "clamp(6px, 1.5vw, 10px) clamp(10px, 3vw, 20px)",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              color: "#3b3b3b",
              fontSize: isMobile ? "12px" : "15px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "12px",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            overflowX: "auto",
            zIndex: 99,
          }}
        >
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                whiteSpace: "nowrap",
                padding: "6px 10px",
                borderRadius: "10px",
                background: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                color: "#2e3d4c",
                fontWeight: 500,
                textDecoration: "none",
                fontSize: "14px",
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export default AdminNavbar;