import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import soap from "../assets/soap-bliss.png";

function Customize() {
    const navigate = useNavigate();

    // Selected options state
    const [selectedScents, setSelectedScents] = useState([]);
    const [selectedTexture, setSelectedTexture] = useState("");
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [addedToCart, setAddedToCart] = useState(false);

    // Available scents
    const scents = [
        { name: "Lavender", price: 1 },
        { name: "Sakura", price: 1 },
        { name: "Coconut", price: 1 },
        { name: "Unscented", price: 0 },
        { name: "Rose", price: 1 },
        { name: "Honey", price: 2 },
    ];

    // Available textures
    const textures = [
        { name: "Smooth", price: 0 },
        { name: "Scrub", price: 2 },
    ];

    // Available ingredients
    const ingredients = [
        { name: "Shea Butter", price: 2 },
        { name: "Aloe Vera", price: 2 },
        { name: "Sugar", price: 1 },
        { name: "Other Stuff", price: 2 },
        { name: "Milk", price: 1 },
        { name: "Love", price: 1 },
    ];

    const isMobile = window.innerWidth <= 768;

    // Simulated login state (change for testing)
    const isLoggedIn = true;

    // Handle multi-select options
    const toggleMultiSelect = (value, selectedValues, setSelectedValues) => {
        if (selectedValues.includes(value)) {
            setSelectedValues(selectedValues.filter((item) => item !== value));
        } else {
            setSelectedValues([...selectedValues, value]);
        }
        setAddedToCart(false);
    };

    // Handle texture selection
    const handleTextureChange = (texture) => {
        setSelectedTexture(texture);
        setAddedToCart(false);
    };

    // Check if all required options are selected
    const isValid =
        selectedScents.length > 0 &&
        selectedTexture !== "" &&
        selectedIngredients.length > 0;

    const basePrice = 7;

    const selectedTexturePrice =
        textures.find((item) => item.name === selectedTexture)?.price || 0;

    const selectedScentsPrice = scents
        .filter((item) => selectedScents.includes(item.name))
        .reduce((sum, item) => sum + item.price, 0);

    const selectedIngredientsPrice = ingredients
        .filter((item) => selectedIngredients.includes(item.name))
        .reduce((sum, item) => sum + item.price, 0);

    // Calculate total price
    const price =
        basePrice +
        selectedTexturePrice +
        selectedScentsPrice +
        selectedIngredientsPrice;

    // Add customized product to cart
    const handleAddToCart = async () => {
        if (!isValid) return;

        try {
            await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: "testUser",
                    productId: "custom-soap", 
                    quantity: 1,
                    customOptions: {
                        scents: selectedScents,
                        texture: selectedTexture,
                        ingredients: selectedIngredients,
                    },
                    customPrice: price,
                }),
            });

            setAddedToCart(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            className="purple-page"
            style={{
                minHeight: "100vh",
                padding: isMobile ? "24px 16px 140px" : "55px 50px",
                boxSizing: "border-box",
            }}
        >
            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: isMobile ? "12px 24px" : "14px 34px",
                    borderRadius: "25px",
                    border: "1px solid rgba(255,255,255,0.35)",
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(12px)",
                    color: "#3b3b3b",
                    fontSize: isMobile ? "15px" : "16px",
                    fontFamily: "Josefin Sans, sans-serif",
                    cursor: "pointer",
                    marginBottom: "20px",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                ← Back
            </button>

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    borderRadius: "30px",
                    padding: isMobile ? "18px 14px" : "20px 26px",
                    minHeight: isMobile ? "auto" : "470px",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "18px",
                    flexWrap: "wrap",
                    backdropFilter: "blur(14px)",
                    overflowX: "hidden",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: "14px",
                        alignItems: "flex-start",
                        width: isMobile ? "100%" : "auto",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            width: isMobile ? "100%" : "auto",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                maxWidth: isMobile ? "100%" : "220px",
                                background: "rgba(255,255,255,0.28)",
                                borderRadius: "14px",
                                padding: "18px",
                                boxSizing: "border-box",
                            }}
                        >
                            <h3
                                style={{
                                    marginTop: 0,
                                    marginBottom: "14px",
                                    fontSize: "18px",
                                    color: "#333",
                                }}
                            >
                                Scent
                            </h3>

                            {scents.map((scent) => (
                                <label
                                    key={scent.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "8px",
                                        marginBottom: "14px",
                                        fontSize: "15px",
                                        color: "#444",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedScents.includes(scent.name)}
                                            onChange={() =>
                                                toggleMultiSelect(
                                                    scent.name,
                                                    selectedScents,
                                                    setSelectedScents
                                                )
                                            }
                                        />
                                        {scent.name}
                                    </div>

                                    <span style={{ fontSize: "14px", color: "#666" }}>
                                        +${scent.price}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div
                            style={{
                                width: "100%",
                                maxWidth: isMobile ? "100%" : "220px",
                                background: "rgba(255,255,255,0.28)",
                                borderRadius: "14px",
                                padding: "18px",
                                boxSizing: "border-box",
                            }}
                        >
                            <h3
                                style={{
                                    marginTop: 0,
                                    marginBottom: "14px",
                                    fontSize: "18px",
                                    color: "#333",
                                }}
                            >
                                Texture
                            </h3>

                            {textures.map((texture) => (
                                <label
                                    key={texture.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "8px",
                                        marginBottom: "16px",
                                        fontSize: "15px",
                                        color: "#444",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="texture"
                                            checked={selectedTexture === texture.name}
                                            onChange={() => handleTextureChange(texture.name)}
                                        />
                                        {texture.name}
                                    </div>

                                    <span style={{ fontSize: "14px", color: "#666" }}>
                                        +${texture.price}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            maxWidth: isMobile ? "100%" : "220px",
                            minHeight: "300px",
                            background: "rgba(255,255,255,0.28)",
                            borderRadius: "14px",
                            padding: "18px",
                            boxSizing: "border-box",
                        }}
                    >
                        <h3
                            style={{
                                marginTop: 0,
                                marginBottom: "14px",
                                fontSize: "18px",
                                color: "#333",
                            }}
                        >
                            Ingredients
                        </h3>

                        {ingredients.map((ingredient) => (
                            <label
                                key={ingredient.name}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "8px",
                                    marginBottom: "16px",
                                    fontSize: "15px",
                                    color: "#444",
                                    cursor: "pointer",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIngredients.includes(ingredient.name)}
                                        onChange={() =>
                                            toggleMultiSelect(
                                                ingredient.name,
                                                selectedIngredients,
                                                setSelectedIngredients
                                            )
                                        }
                                    />
                                    {ingredient.name}
                                </div>

                                <span style={{ fontSize: "14px", color: "#666" }}>
                                    +${ingredient.price}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        minHeight: isMobile ? "auto" : "420px",
                        display: "flex",
                        flexDirection: "column",
                        width: isMobile ? "100%" : "auto",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                            marginBottom: "12px",
                        }}
                    >
                        <img
                            src={soap}
                            alt="Custom Soap"
                            style={{
                                width: "300px",
                                height: "300px",
                                objectFit: "contain",
                            }}
                        />
                    </div>

                    {!isValid && (
                        <p
                            style={{
                                color: "#ff5a45",
                                fontSize: isMobile ? "18px" : "22px",
                                fontWeight: "500",
                                textAlign: "center",
                                marginTop: "0",
                                marginBottom: "10px",
                            }}
                        >
                            Please select all required options
                        </p>
                    )}

                    {!isMobile && (
                        <div
                            style={{
                                marginTop: "auto",
                                alignSelf: "flex-end",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: "12px",
                            }}
                        >
                            <div
                                style={{
                                    width: "180px",
                                    padding: "16px 18px",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.16)",
                                    border: "1px solid rgba(255,255,255,0.35)",
                                    textAlign: "center",
                                    color: "#444",
                                    fontWeight: "700",
                                    fontSize: "16px",
                                    boxSizing: "border-box",
                                }}
                            >
                                Price: ${price.toFixed(2)}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "20px",
                                    flexWrap: "wrap",
                                }}
                            >
                                {/* Show message when added */}
                                {addedToCart && isValid && (
                                    <p
                                        style={{
                                            color: "#39a86f",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                            margin: 0,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Customized product added to cart
                                    </p>
                                )}

                                <div
                                    style={{
                                        width: "160px",
                                        padding: "16px",
                                        borderRadius: "24px",
                                        background: "rgba(255,255,255,0.12)",
                                        border: "1px solid rgba(255,255,255,0.30)",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <Button
                                        text="Add to Cart"
                                        variant={isValid ? "purple" : "purpleDisabled"}
                                        disabled={!isValid}
                                        style={{ width: "100%" }}
                                        onClick={handleAddToCart}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isMobile && (
                <div
                    style={{
                        position: "fixed",
                        left: "50%",
                        bottom: "20px",
                        transform: "translateX(-50%)",
                        width: "calc(100% - 32px)",
                        maxWidth: "420px",
                        zIndex: 100,
                        background: "rgba(255,255,255,0.14)",
                        border: "1px solid rgba(255,255,255,0.30)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "22px",
                        padding: "14px",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            padding: "14px 16px",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.16)",
                            border: "1px solid rgba(255,255,255,0.35)",
                            textAlign: "center",
                            color: "#444",
                            fontWeight: "700",
                            fontSize: "16px",
                            boxSizing: "border-box",
                            marginBottom: "10px",
                        }}
                    >
                        {/* Display price */}
                        Price: ${price.toFixed(2)}
                    </div>

                    {addedToCart && isValid && (
                        <p
                            style={{
                                color: "#39a86f",
                                fontSize: "14px",
                                fontWeight: "600",
                                margin: "0 0 10px 0",
                                textAlign: "center",
                            }}
                        >
                            Customized product added to cart
                        </p>
                    )}

                    <Button
                        text="Add to Cart"
                        variant={isValid ? "purple" : "purpleDisabled"}
                        disabled={!isValid}
                        style={{ width: "100%" }}
                        onClick={handleAddToCart}
                    />
                </div>
            )}
        </div>
    );
}

export default Customize;