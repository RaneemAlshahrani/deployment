// Product card component
import Button from "./Button";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Card({ product }) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);

    // Simulated login state (change for testing)
    const isLoggedIn = true;

    // Check if product is in wishlist
    useEffect(() => {
        const storedWishlist =
            JSON.parse(localStorage.getItem("wishlistItems")) || [];

        const exists = storedWishlist.some((item) => item.id === product._id);
        setLiked(exists);
    }, [product._id]);

    // Toggle wishlist
    const handleWishlistClick = () => {
        if (!isLoggedIn) {
            alert("Please login first");
            return;
        }

        const storedWishlist =
            JSON.parse(localStorage.getItem("wishlistItems")) || [];

        const exists = storedWishlist.some((item) => item.id === product._id);

        let updatedWishlist;

        if (exists) {
            updatedWishlist = storedWishlist.filter((item) => item.id !== product._id);
            setLiked(false);
        } else {
            updatedWishlist = [...storedWishlist, { id: product._id, quantity: 1 }];
            setLiked(true);
        }

        localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    };
    // Add product to cart
    const handleAddToCart = () => {
        if (!isLoggedIn) {
            alert("Please login first");
            return;
        }

        const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItem = storedCart.find((item) => item.id === product._id);

        let updatedCart;

        if (existingItem) {
            updatedCart = storedCart.map((item) =>
                item.id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...storedCart, { id: product._id, quantity: 1 }];
        }

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        alert(`${product.name} added to cart`);
    };

    return (
        <div
            style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: "20px",
                padding: "10px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "10px",
                    height: "24px",
                }}
            >
                {/* Wishlist icon */}
                {!product.customizable && (
                    <img
                        src={liked ? heartFilled : heart}
                        alt="wishlist"
                        onClick={handleWishlistClick}
                        style={{
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            transform: liked ? "scale(1.2)" : "scale(1)",
                        }}
                    />
                )}
            </div>

            <div
                style={{
                    width: "100%",
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "15px",
                }}
            >
                {product.image ? (
                    <img
                        src={
                            product.image?.startsWith("http")
                                ? product.image
                                : new URL(`../assets/${product.image}`, import.meta.url).href
                        }
                        alt={product.name}
                        style={{
                            maxWidth: "150px",
                            maxHeight: "120px",
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            fontSize: "80px",
                            fontWeight: "100",
                            color: "#b07ae8",
                            lineHeight: 1,
                        }}
                    >
                        +
                    </div>
                )}
            </div>

            <h3
                style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#333",
                    marginBottom: "10px",
                }}
            >
                {product.name}
            </h3>

            <p
                style={{
                    fontSize: "16px",
                    color: "#666",
                    marginBottom: "16px",
                }}
            >
                {product.price > 0 ? `$${product.price.toFixed(2)}` : "$???"}
            </p>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "20px",
                }}
            >
                {/* Customize product */}
                {product.customizable ? (
                    <Button
                        text="Customize"
                        variant="purple"
                        onClick={() => navigate("/customize")}
                    />
                ) : product.stock > 0 ? (
                    <>
                        <Button
                            text="Add to Cart"
                            variant="purple"
                            onClick={handleAddToCart}
                        />
                        <Button
                            text="Product Details"
                            variant="purple"
                            onClick={() => navigate(`/product-details/${product._id}`)}
                        />
                    </>
                ) : (
                    <>
                        <Button text="Out Of Stock" variant="purpleDisabled" disabled />
                        <Button
                            text="Product Details"
                            variant="purple"
                            onClick={() => navigate(`/product-details/${product._id}`)}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default Card;