import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [stockValues, setStockValues] = useState({});
  const [savedMessage, setSavedMessage] = useState("");
  const [customOptions, setCustomOptions] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/inventory");
        const data = await res.json();

        setProducts(data);

        const stockMap = {};
        data.forEach((product) => {
          stockMap[product._id] = product.stock;
        });

        setStockValues(stockMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  // ✅ FETCH CUSTOM OPTIONS
  useEffect(() => {
    fetch("http://localhost:5000/api/custom-options")
      .then((res) => res.json())
      .then((data) => setCustomOptions(data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ HANDLE INPUT CHANGE
  const handleStockChange = (productId, value) => {
    setStockValues((prev) => ({
      ...prev,
      [productId]: value === "" ? "" : Number(value),
    }));
  };

  // ✅ UPDATE STOCK (IMPORTANT)
  const handleUpdateStock = async (productId) => {
    try {
      const newStock = stockValues[productId];

      const response = await fetch(
        `http://localhost:5000/api/admin/inventory/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock: newStock }),
        }
      );

      if (!response.ok) throw new Error("Failed");

      const updatedProduct = await response.json();

      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? updatedProduct : product
        )
      );

      setSavedMessage("Stock updated!");
    } catch (error) {
      console.error(error);
      setSavedMessage("Failed to update");
    }
  };

  // ✅ TOGGLE CUSTOM OPTION
  const handleToggleOption = async (option) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/custom-options/${option._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            available: !option.available,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed");

      setCustomOptions((prev) =>
        prev.map((item) =>
          item._id === option._id
            ? { ...item, available: !item.available }
            : item
        )
      );

      setSavedMessage("Custom option updated!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="purple-page" style={{ minHeight: "100vh", padding: "18px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "18px" }}>
        <AdminSidebar activePage="inventory" />

        <div style={mainPanelStyle}>
          {savedMessage && (
            <p style={{ textAlign: "center", color: "#ff4d6d" }}>{savedMessage}</p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "22px" }}>
            {products.map((product) => {
              const isLow = product.stock <= 5;

              return (
                <div key={product._id} style={inventoryCardStyle}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "170px", height: "170px", objectFit: "contain" }}
                  />

                  <h3>{product.name}</h3>

                  {/* ✅ LOW STOCK */}
                  <p style={{ color: isLow ? "red" : "green" }}>
                    {isLow ? "Low Stock 🔴" : "In Stock 🟢"}
                  </p>

                  <input
                    type="number"
                    min="0"
                    value={stockValues[product._id] ?? product.stock}
                    onChange={(e) =>
                      handleStockChange(product._id, e.target.value)
                    }
                    style={stockInputStyle}
                  />

                  {/* ✅ SAVE BUTTON */}
                  <button
                    style={updateButtonStyle}
                    onClick={() => handleUpdateStock(product._id)}
                  >
                    Save
                  </button>
                </div>
              );
            })}
          </div>

          {/* CUSTOM OPTIONS */}
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Custom Options</h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {customOptions.map((option) => (
                <div key={option._id} style={inventoryCardStyle}>
                  <h3>{option.name}</h3>
                  <p>{option.type}</p>

                  <input
                    type="number"
                    value={option.stock}
                    onChange={async (e) => {
                      const newStock = Number(e.target.value);

                      await fetch(
                        `http://localhost:5000/api/custom-options/${option._id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ stock: newStock }),
                        }
                      );

                      setCustomOptions((prev) =>
                        prev.map((item) =>
                          item._id === option._id
                            ? { ...item, stock: newStock }
                            : item
                        )
                      );
                    }}
                    style={stockInputStyle}
                  />

                  <button
                    onClick={() => handleToggleOption(option)}
                    style={{
                      ...updateButtonStyle,
                      background:
                        option.available && option.stock > 0
                          ? "#39a86f"
                          : "#ff5a45",
                    }}
                  >
                    {option.available && option.stock > 0
                      ? "Available"
                      : "Unavailable"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mainPanelStyle = {
  background: "rgba(255,255,255,0.10)",
  borderRadius: "28px",
  padding: "22px",
};

const inventoryCardStyle = {
  width: "200px",
  background: "rgba(255,255,255,0.22)",
  borderRadius: "18px",
  padding: "18px",
  textAlign: "center",
};

const stockInputStyle = {
  width: "60px",
  fontSize: "18px",
  textAlign: "center",
};

const updateButtonStyle = {
  marginTop: "10px",
  background: "#8f42d9",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "6px 12px",
  cursor: "pointer",
};

export default InventoryManagement;