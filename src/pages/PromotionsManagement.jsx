import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/promotionsManagement.css";

function PromotionsManagement() {
  const [promotions, setPromotions] = useState([]);

  const [form, setForm] = useState({
    code: "",
    expiry: "",
    type: "",
    value: "",
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/promotions");
      const data = await res.json();

      setPromotions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load promotions.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  const handleCreate = async () => {
    setSaved(false);
    setError("");

    const code = form.code.trim().toLowerCase();
    const expiry = form.expiry;
    const type = form.type;
    const value = form.value.trim();

    if (!code || !expiry || !type || !value) {
      setError("Please fill in all fields.");
      return;
    }

    const percent = parseFloat(value.replace("%", ""));

    if (Number.isNaN(percent) || percent <= 0 || percent > 100) {
      setError("Discount value must be between 1 and 100.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          expiry,
          type,
          value: percent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create promo code.");
        return;
      }

      setPromotions((prev) => [data, ...prev]);
      setSaved(true);

      setForm({
        code: "",
        expiry: "",
        type: "",
        value: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create promo code.");
    }
  };

  const handleDelete = async (promotionId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/promotions/${promotionId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete promotion");
      }

      setPromotions((prev) =>
        prev.filter((promo) => promo._id !== promotionId)
      );

      setSaved(false);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete promo code.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="purple-page promo-page">
      <div className="promo-layout">
        <AdminSidebar activePage="promotions" />

        <div className="promo-main">
          <div className="promo-panel">
            <h2>Create Promo Code</h2>

            <div className="promo-form-grid">
              <div className="promo-field">
                <label>Promo Code</label>
                <input
                  type="text"
                  name="code"
                  placeholder="Enter promo code"
                  value={form.code}
                  onChange={handleChange}
                />
              </div>

              <div className="promo-field">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                />
              </div>

              <div className="promo-field">
                <label>Discount Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="All Products">All Products</option>
                  <option value="Specific Product">Specific Product</option>
                  <option value="Category">Category</option>
                  <option value="Minimum Order">Minimum Order</option>
                </select>
              </div>

              <div className="promo-field">
                <label>Discount Value</label>
                <input
                  type="text"
                  name="value"
                  placeholder="e.g. 25%"
                  value={form.value}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="promo-actions">
              <button className="promo-create-btn" onClick={handleCreate}>
                Create
              </button>

              {saved && (
                <span className="promo-saved-text">
                  Promo code created successfully!
                </span>
              )}

              {error && (
                <span className="promo-saved-text" style={{ color: "#ff4d6d" }}>
                  {error}
                </span>
              )}
            </div>
          </div>

          <div className="promo-panel" style={{ marginTop: "24px" }}>
            <h2>Existing Promo Codes</h2>

            {promotions.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {promotions.map((promo) => (
                    <tr key={promo._id}>
                      <td>{promo.code}</td>
                      <td>{promo.type}</td>
                      <td>{promo.value}%</td>
                      <td>{formatDate(promo.expiry)}</td>
                      <td>{promo.active ? "Active" : "Inactive"}</td>
                      <td>
                        <button
                          className="promo-create-btn"
                          style={{ background: "#ff4d6d" }}
                          onClick={() => handleDelete(promo._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center" }}>No promo codes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionsManagement;