import { useEffect, useMemo, useState } from "react";
import rose from "../assets/rose.png";
import lavender from "../assets/lavender.png";
import rosemary from "../assets/rosemary.png";
import soap from "../assets/soap-bliss.png";
import AdminSidebar from "../components/AdminSidebar";

function ProductManagement() {
  const defaultProducts = useMemo(
    () => [
      {
        id: 1,
        name: "Sakura Bliss",
        description: "A unique soap, please buy from us :)",
        price: 3,
        ingredients: "Sugar, Sakura, love, Milk, Other stuff, xxxx",
        stock: 10,
        image: rose,
      },
      {
        id: 2,
        name: "Lavender Bliss",
        description: "A relaxing lavender soap for daily use.",
        price: 3,
        ingredients: "Lavender, Milk, Oils, Soft fragrance",
        stock: 8,
        image: lavender,
      },
      {
        id: 3,
        name: "Rosemary Bliss",
        description: "Fresh herbal soap with rosemary extract.",
        price: 3,
        ingredients: "Rosemary, Olive oil, Milk, Herbs",
        stock: 10,
        image: rosemary,
      },
      {
        id: 4,
        name: "Soap Bliss",
        description: "Simple handmade soap bar.",
        price: 3,
        ingredients: "Soap base, Oils, Fragrance",
        stock: 12,
        image: soap,
      },
    ],
    []
  );

  const [products, setProducts] = useState([]);
  const [mode, setMode] = useState("list");
  const [savedMessage, setSavedMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    ingredients: "",
    stock: "",
    image: rose,
    theme: "pink",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        if (data.length > 0) {
          setProducts(data);
        } else {
          setProducts(defaultProducts);
        }
      } catch (err) {
        console.error(err);
        setProducts(defaultProducts);
      }
    };

    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      price: "",
      ingredients: "",
      stock: "",
      image: rose,
    });
    setFormError("");
  };

  const handleAddClick = () => {
    resetForm();
    setSavedMessage("");
    setMode("add");
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      ingredients: product.ingredients,
      stock: product.stock,
      image: product.image,
      theme: product.theme || "pink",
    });
    setFormError("");
    setSavedMessage("");
    setMode("edit");
  };

  const handleDelete = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
      setSavedMessage("Deleted !");
    } catch (err) {
      console.error(err);
      setFormError("Failed to delete");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));

    setFormError("");
    setSavedMessage("");
  };

  const handleSaveProduct = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price === "" ||
      !formData.ingredients.trim() ||
      formData.stock === ""
    ) {
      setFormError("Please fill all product fields.");
      return;
    }

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // مهم: الصورة
      data.append("image", imageFile);

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed");

      setSavedMessage("Added successfully 🎉");

    } catch (error) {
      console.error(error);
      setFormError("Error adding product");
    }
  };

  const getEditTheme = () => {
    if (formData.image === rose) {
      return {
        pageClass: "pink-page",
        overlay: "linear-gradient(135deg, rgba(180,95,105,0.12), rgba(217,154,165,0.1))",
        buttonColor: "#b84a57",
        labelColor: "#b04f60",
      };
    }

    if (formData.image === rosemary) {
      return {
        pageClass: "yellow-page",
        overlay: "linear-gradient(135deg, rgba(216,182,79,0.10), rgba(243,223,143,0.08))",
        buttonColor: "#9c8830",
        labelColor: "#8a7623",
      };
    }

    return {
      pageClass: "purple-page",
      overlay: "linear-gradient(135deg, rgba(203,183,230,0.12), rgba(168,139,216,0.1))",
      buttonColor: "#8f42d9",
      labelColor: "#7f58ba",
    };
  };

  const editTheme = getEditTheme();

  return (
    <div
      className={mode === "edit" ? editTheme.pageClass : "purple-page"}
      style={{
        minHeight: "100vh",
        padding: "18px 24px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="product-management-layout"
        style={{
          display: "grid",
          gridTemplateColumns: mode === "edit" ? "1fr" : "200px 1fr",
          gap: "18px",
        }}
      >
        {mode !== "edit" && <AdminSidebar activePage="products" />}

        <div
          style={{
            ...(mode === "edit"
              ? {
                background: "transparent",
                border: "none",
                borderRadius: 0,
                backdropFilter: "none",
                padding: 0,
                minHeight: "calc(100vh - 36px)",
              }
              : mainPanelStyle),
          }}
        >
          {mode === "list" ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <button style={addButtonStyle} onClick={handleAddClick}>
                  Add Product
                </button>
              </div>

              {savedMessage && (
                <p
                  style={{
                    margin: "0 0 14px",
                    color: "#ff4d6d",
                    fontSize: "13px",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {savedMessage}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "22px",
                  alignItems: "flex-start",
                }}
              >
                {products.map((product) => (
                  <div key={product._id || product.id} style={productCardStyle}>
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : new URL(`../assets/${product.image}`, import.meta.url).href
                      }
                      alt={product.name}
                      style={{
                        width: "170px",
                        height: "170px",
                        objectFit: "contain",
                        marginBottom: "12px",
                      }}
                    />

                    <h3
                      style={{
                        margin: "0 0 28px",
                        fontSize: "18px",
                        color: "#2e3d4c",
                        fontWeight: "500",
                      }}
                    >
                      {product.name}
                    </h3>

                    <button
                      style={purpleButtonStyle}
                      onClick={() => handleDelete(product._id || product.id)}
                    >
                      Delete
                    </button>

                    <button
                      style={{ ...purpleButtonStyle, marginTop: "10px" }}
                      onClick={() => handleEdit(product)}
                    >
                      Edit Product
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : mode === "add" ? (
            <div
              className="product-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 380px",
                gap: "16px",
                alignItems: "start",
                minHeight: "520px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={fieldBoxStyle}>
                  <label style={fieldLabelStyle}>Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={wideInputStyle}
                  />
                </div>

                <div style={fieldBoxStyle}>
                  <label style={fieldLabelStyle}>Description</label>
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={wideInputStyle}
                  />
                </div>

                <div style={fieldBoxStyle}>
                  <label style={fieldLabelStyle}>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    style={smallInputStyle}
                  />
                </div>

                <div style={fieldBoxStyle}>
                  <label style={fieldLabelStyle}>Ingredients</label>
                  <input
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    style={wideInputStyle}
                  />
                </div>

                <div style={fieldBoxStyle}>
                  <label style={fieldLabelStyle}>In stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    style={smallInputStyle}
                  />
                </div>

                <div style={fieldBoxStyle}>
                  <label style={fieldLabelStyle}>Theme</label>
                  <div style={fieldBoxStyle}>
                    <label style={fieldLabelStyle}>Theme</label>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>

                      {["pink", "purple", "yellow"].map((color) => (
                        <div
                          key={color}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, theme: color }))
                          }
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            transition: "0.2s",

                            background:
                              color === "pink"
                                ? "#f8b6c2"
                                : color === "purple"
                                  ? "#cbb7e6"
                                  : "#f5e6a3",

                            border:
                              formData.theme === color
                                ? "3px solid black"
                                : "1px solid #ccc",
                          }}
                        />
                      ))}

                    </div>
                  </div>
                </div>
              </div>

              <div style={imagePanelStyle}>
                <p style={{ textAlign: "center", fontWeight: "600", color: "#2e3d4c" }}>
                  Image
                </p>

                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Selected"
                    style={{
                      width: "240px",
                      height: "240px",
                      objectFit: "contain",
                      margin: "0 auto 16px",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "240px",
                      height: "240px",
                      margin: "0 auto 16px",
                      border: "2px dashed #aaa",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#555",
                      fontSize: "20px",
                    }}
                  >
                    Select an image
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                {formError && <p style={{ color: "red" }}>{formError}</p>}
                {savedMessage && <p style={{ color: "#ff4d6d" }}>{savedMessage}</p>}

                <button style={purpleButtonStyle} onClick={handleSaveProduct}>
                  Add Product
                </button>
              </div>
            </div>
          ) : (
            <div
              className="edit-layout"
              style={{
                minHeight: "calc(100vh - 36px)",
                background: editTheme.overlay,
                borderRadius: "0",
                padding: "24px 26px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.25fr 0.95fr",
                  gap: "28px",
                  alignItems: "start",
                }}
              >
                <div>
                  <button
                    style={backButtonStyle}
                    onClick={() => {
                      resetForm();
                      setSavedMessage("");
                      setMode("list");
                    }}
                  >
                    ← Back
                  </button>

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "560px",
                    }}
                  >
                    <img
                      src={formData.image}
                      alt={formData.name}
                      style={{
                        width: "100%",
                        maxWidth: "720px",
                        maxHeight: "560px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    paddingTop: "22px",
                  }}
                >
                  <div style={pinkFieldBoxStyle}>
                    <label style={{ ...pinkFieldLabelStyle, color: editTheme.labelColor }}>
                      Description
                    </label>
                    <input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      style={wideInputStyle}
                    />
                  </div>

                  <div style={pinkFieldBoxStyle}>
                    <label style={{ ...pinkFieldLabelStyle, color: editTheme.labelColor }}>
                      Price:
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      style={smallInputStyle}
                    />
                  </div>

                  <div style={pinkFieldBoxStyle}>
                    <label style={{ ...pinkFieldLabelStyle, color: editTheme.labelColor }}>
                      Ingredients
                    </label>
                    <input
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleChange}
                      style={wideInputStyle}
                    />
                  </div>

                  <div style={pinkFieldBoxStyle}>
                    <label style={{ ...pinkFieldLabelStyle, color: editTheme.labelColor }}>
                      In stock:
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      style={smallInputStyle}
                    />
                  </div>

                  <div style={pinkFieldBoxStyle}>
                    <label style={{ ...pinkFieldLabelStyle, color: editTheme.labelColor }}>
                      Theme
                    </label>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      {["pink", "purple", "yellow"].map((color) => (
                        <div
                          key={color}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, theme: color }))
                          }
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            transition: "0.2s",

                            background:
                              color === "pink"
                                ? "#f8b6c2"
                                : color === "purple"
                                  ? "#cbb7e6"
                                  : "#f5e6a3",

                            border:
                              formData.theme === color
                                ? "3px solid black"
                                : "1px solid #ccc",

                            transform:
                              formData.theme === color ? "scale(1.1)" : "scale(1)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "120px",
                      background: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.35)",
                      borderRadius: "24px",
                      padding: "18px",
                      textAlign: "center",
                    }}
                  >
                    {savedMessage && (
                      <p
                        style={{
                          margin: "0 0 8px",
                          color: "#ff4d6d",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {savedMessage}
                      </p>
                    )}

                    {formError && (
                      <p
                        style={{
                          margin: "0 0 8px",
                          color: "red",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {formError}
                      </p>
                    )}

                    <button
                      style={{
                        ...editButtonStyle,
                        background: editTheme.buttonColor,
                      }}
                      onClick={handleSaveProduct}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1100px) {
            .product-management-layout {
              grid-template-columns: 1fr !important;
            }

            .product-form-grid,
            .edit-layout > div {
              grid-template-columns: 1fr !important;
            }
          }

          .sidebar {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .sidebar button {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.35);
            border-radius: 18px;
            padding: 14px 12px;
            font-family: Josefin Sans, sans-serif;
            font-size: 18px;
            color: #2e3d4c;
            cursor: pointer;
          }

          .sidebar .active {
            font-weight: 700;
          }

          .logo-card {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.35);
            border-radius: 24px;
            backdrop-filter: blur(14px);
            padding: 16px;
            text-align: center;
          }

          .logo-card img {
            width: 100%;
            max-width: 120px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
          }

          .spacer {
            flex: 1;
          }
        `}
      </style>
    </div>
  );
}

const mainPanelStyle = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "28px",
  backdropFilter: "blur(14px)",
  padding: "22px",
  minHeight: "560px",
  boxSizing: "border-box",
};

const productCardStyle = {
  width: "200px",
  background: "rgba(255,255,255,0.22)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "18px",
  padding: "18px 16px 14px",
  textAlign: "center",
};

const fieldBoxStyle = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.30)",
  borderRadius: "24px",
  padding: "10px 18px 18px",
};

const imagePanelStyle = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.30)",
  borderRadius: "24px",
  padding: "14px 18px 18px",
  minHeight: "300px",
};

const fieldLabelStyle = {
  display: "block",
  textAlign: "center",
  marginBottom: "8px",
  fontSize: "15px",
  color: "#2e3d4c",
  fontWeight: "600",
};

const wideInputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #8f8f8f",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.95)",
};

const smallInputStyle = {
  width: "80px",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #8f8f8f",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.95)",
  display: "block",
  margin: "0 auto",
  textAlign: "center",
};

const purpleButtonStyle = {
  background: "#8f42d9",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 18px",
  fontFamily: "Josefin Sans, sans-serif",
  fontWeight: "600",
  cursor: "pointer",
  minWidth: "108px",
};

const imageSelectButtonStyle = {
  background: "rgba(255,255,255,0.28)",
  color: "#2e3d4c",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "8px",
  padding: "8px 12px",
  fontFamily: "Josefin Sans, sans-serif",
  cursor: "pointer",
};

const addButtonStyle = {
  background: "#8f42d9",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontFamily: "Josefin Sans, sans-serif",
  fontWeight: "600",
  cursor: "pointer",
  width: "110px",
};

const backButtonStyle = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "24px",
  padding: "12px 28px",
  fontFamily: "Josefin Sans, sans-serif",
  fontSize: "18px",
  color: "#2e3d4c",
  cursor: "pointer",
};

const pinkFieldBoxStyle = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.30)",
  borderRadius: "24px",
  padding: "10px 18px 18px",
};

const pinkFieldLabelStyle = {
  display: "block",
  textAlign: "center",
  marginBottom: "8px",
  fontSize: "15px",
  fontWeight: "600",
};

const editButtonStyle = {
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 28px",
  fontFamily: "Josefin Sans, sans-serif",
  fontWeight: "600",
  cursor: "pointer",
};

export default ProductManagement;