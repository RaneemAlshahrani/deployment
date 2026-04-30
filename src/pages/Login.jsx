import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useMemo(() => {
    const users = JSON.parse(localStorage.getItem("users"));

    if (!users || users.length === 0) {
      const defaultUsers = [
        { id: 1, username: "admin", password: "admin123", role: "admin" },
        { id: 2, username: "user", password: "user123", role: "user" },
        { id: 3, username: "customerservice", password: "customer123", role: "customer-service" },
      ];

      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (user) =>
        user.username.trim().toLowerCase() === form.username.trim().toLowerCase() &&
        user.password === form.password
    );

    if (!matchedUser) {
      setError("Invalid username or password");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    if (matchedUser.role === "admin") {
      navigate("/admin-dashboard");
    } else if (matchedUser.role === "customer-service") {
      navigate("/customer-service/tickets");
    } else {
      navigate("/home");
    }
  };

  return (
    <div
      className="purple-page"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Background */}
      <img
        src={bubble7}
        alt=""
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          width: "430px",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      <img
        src={bubble8}
        alt=""
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "100px",
          width: "360px",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "28px",
          backdropFilter: "blur(16px)",
          padding: "38px 42px 28px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: "0 0 18px",
            fontSize: "24px",
            color: "#2e3d4c",
            fontWeight: "700",
          }}
        >
          Login
        </h1>

        {/* ✅ FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "10px" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={{ ...inputStyle, paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={eyeStyle}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                margin: "0 0 10px",
                color: "#ff3d5a",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {/* ✅ Submit */}
          <button type="submit" style={mainButtonStyle}>
            Log in
          </button>
        </form>

        {/* Guest */}
        <button
          onClick={() => navigate("/home")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "2px solid #bb5bb9",
            background: "rgba(255,255,255,0.4)",
            color: "#bb5bb9",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Continue as Guest
        </button>

        {/* Register */}
        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontSize: "12px",
          }}
        >
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            style={{ cursor: "pointer", fontWeight: "600" }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  color: "#394150",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #8d8d8d",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.95)",
};

const eyeStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

const mainButtonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  background: "#bb5bb9",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "600",
  fontFamily: "Josefin Sans, sans-serif",
  cursor: "pointer",
};

export default Login;