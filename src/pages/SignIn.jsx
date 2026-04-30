import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";

function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!form.username.trim() || !form.password.trim() || !form.confirm.trim()) {
      setError("Please fill all fields");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    const usernameExists = users.some(
      (user) =>
        user.username.toLowerCase() === form.username.trim().toLowerCase()
    );

    if (usernameExists) {
      setError("Username already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: form.username.trim(),
      username: form.username.trim(),
      password: form.password,
      role: "user",
      email: "",
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    navigate("/");
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
      <img src={bubble7} alt="" style={{ position: "absolute", opacity: 0.35 }} />
      <img src={bubble8} alt="" style={{ position: "absolute", opacity: 0.2 }} />

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
        }}
      >
        <h1 style={{ marginBottom: "18px" }}>Sign in</h1>

        {/* ✅ FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
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
          <div style={{ marginBottom: "16px" }}>
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
                onClick={() => setShowPassword((p) => !p)}
                style={eyeStyle}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          {/* Confirm */}
          <div style={{ marginBottom: "10px" }}>
            <label style={labelStyle}>Confirm</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="Confirm"
                value={form.confirm}
                onChange={handleChange}
                style={{ ...inputStyle, paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowConfirm((p) => !p)}
                style={eyeStyle}
              >
                {showConfirm ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "#ff3d5a", fontSize: "12px" }}>{error}</p>
          )}

          {/* ✅ Enter يشتغل */}
          <button type="submit" style={mainButtonStyle}>
            Sign in
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px" }}>
          or{" "}
          <span
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", fontWeight: "600" }}
          >
            Login
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

export default SignIn;