import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";
import profile from "../assets/profile-picture.png";

function ProductDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [addedToCart, setAddedToCart] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [liked, setLiked] = useState(false);

    // Simulated login state (change for testing)
    const isLoggedIn = true;

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Product data
    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setReviews(data.reviews || []);
            })
            .catch((err) => console.log(err));
    }, [id]);

    if (!product) {
        return (
            <div
                className="pink-page"
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ff4d3d",
                    fontSize: "32px",
                    textAlign: "center",
                    padding: "20px",
                }}
            >
                Product not available
            </div>
        );
    }

    const pageClass =
        product.theme === "purple"
            ? "purple-page"
            : product.theme === "yellow"
                ? "yellow-page"
                : "pink-page";

    // Add product to cart
    const handleAddToCart = () => {
        setAddedToCart(false);

        if (!isLoggedIn) {
            alert("Please login first");
            return;
        }

        if (product.stock <= 0) {
            alert("Out of stock");
            return;
        }
        // Get cart from localStorage
        let storedCart =
            JSON.parse(localStorage.getItem("cartItems")) || [];

        const existingItem = storedCart.find(
            (item) => item.id === product._id
        );

        let updatedCart;

        if (existingItem) {
            updatedCart = storedCart.map((item) =>
                item.id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [
                ...storedCart,
                { id: product._id, quantity: 1 },
            ];
        }

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));

        setAddedToCart(true);
    };

    // Toggle wishlist
    const handleWishlistClick = () => {
        if (!isLoggedIn) {
            alert("Please login first");
            return;
        }

        setLiked(!liked);
    };

    // Add new review
    const handleSendReview = () => {
        if (!isLoggedIn) {
            alert("Please login first");
            return;
        }

        if (!reviewText.trim()) return;

        setReviews([...reviews, reviewText]);
        setReviewText("");
    };

    return (
        <div
            className={pageClass}
            style={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                padding: isMobile ? "20px 16px 30px" : "30px 48px 24px",
                boxSizing: "border-box",
            }}
        >
            <img
                src={bubble7}
                alt="bubble left"
                style={{
                    position: "absolute",
                    left: isMobile ? "-50px" : "-10px",
                    bottom: "0",
                    width: isMobile ? "220px" : "360px",
                    opacity: 0.18,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            <img
                src={bubble8}
                alt="bubble right"
                style={{
                    position: "absolute",
                    right: isMobile ? "-40px" : "0",
                    top: "0",
                    width: isMobile ? "220px" : "360px",
                    opacity: 0.16,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            {/* Go back to previous page */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: isMobile ? "12px 28px" : "14px 36px",
                    borderRadius: "30px",
                    border: "1px solid rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    color: "#3b3b3b",
                    fontSize: isMobile ? "16px" : "18px",
                    fontFamily: "Josefin Sans, sans-serif",
                    cursor: "pointer",
                    marginBottom: "18px",
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
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "18px" : "42px",
                    alignItems: isMobile ? "stretch" : "flex-start",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        minHeight: isMobile ? "auto" : "620px",
                        display: "flex",
                        alignItems: isMobile ? "center" : "flex-start",
                        justifyContent: "center",
                        position: "relative",
                        paddingTop: isMobile ? "0" : "25px",
                        order: isMobile ? 1 : 0,
                    }}
                >
                    <img
                        src={
                            product.image?.startsWith("http")
                                ? product.image
                                : new URL(`../assets/${product.image}`, import.meta.url).href
                        }
                        alt={product.name}
                        style={{
                            width: "100%",
                            maxWidth: isMobile
                                ? "320px"
                                : product.theme === "purple"
                                    ? "650px"
                                    : "700px",
                            objectFit: "contain",
                            filter: "drop-shadow(0px 24px 40px rgba(0,0,0,0.16))",
                            display: "block",
                        }}
                    />
                </div>

                <div
                    style={{
                        width: isMobile ? "100%" : "390px",
                        maxWidth: isMobile ? "100%" : "390px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        marginTop: isMobile ? "0" : "22px",
                        order: isMobile ? 2 : 0,
                    }}
                >
                    <div style={box(isMobile)}>
                        <p style={labelStyle(isMobile)}>Description</p>
                        <p style={valueStyle(isMobile)}>{product.description}</p>
                    </div>

                    <div style={box(isMobile)}>
                        <p style={labelStyle(isMobile)}>Price: ${product.price.toFixed(2)}</p>
                    </div>

                    <div style={box(isMobile)}>
                        <p style={labelStyle(isMobile)}>Ingredients</p>
                        <p style={valueStyle(isMobile)}>{product.ingredients?.join(", ")}</p>
                    </div>

                    <div style={box(isMobile)}>
                        <p style={labelStyle(isMobile)}>
                            {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                        </p>
                    </div>

                    <div
                        style={{
                            ...box(isMobile),
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "12px",
                            paddingTop: "16px",
                            paddingBottom: "14px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "14px",
                                flexWrap: "wrap",
                                width: "100%",
                            }}
                        >
                            {/* Add to cart button */}
                            <Button
                                text="Add to Cart"
                                variant={product.stock > 0 ? "primary" : "purpleDisabled"}
                                disabled={product.stock <= 0}
                                style={{
                                    width: "170px",
                                    borderRadius: "14px",
                                }}
                                onClick={handleAddToCart}
                            />

                            <img
                                src={liked ? heartFilled : heart}
                                alt="wishlist"
                                onClick={handleWishlistClick}
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    cursor: "pointer",
                                    opacity: 0.8,
                                    transition: "all 0.2s ease",
                                    transform: liked ? "scale(1.2)" : "scale(1)",
                                }}
                            />
                        </div>

                        {addedToCart && (
                            <p
                                style={{
                                    margin: 0,
                                    textAlign: "center",
                                    color: "#39a86f",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                }}
                            >
                                Item added successfully
                            </p>
                        )}

                        {product.stock <= 0 && (
                            <p
                                style={{
                                    margin: 0,
                                    textAlign: "center",
                                    color: "#ff4d3d",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                }}
                            >
                                Out of stock
                            </p>
                        )}
                    </div>

                    <div style={{ ...box(isMobile), paddingTop: "14px", paddingBottom: "14px" }}>
                        <p style={labelStyle(isMobile)}>Reviews</p>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "12px",
                            }}
                        >
                            <img src={profile} alt="profile" style={reviewIconStyle(isMobile)} />

                            <input
                                type="text"
                                placeholder="type here"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "11px 14px",
                                    borderRadius: "18px",
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.25)",
                                    color: "#7a4c56",
                                    fontSize: "14px",
                                    fontFamily: "Josefin Sans, sans-serif",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />

                            <button
                                onClick={handleSendReview}
                                style={{
                                    padding: isMobile ? "10px 12px" : "10px 14px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: "#8f4bd8",
                                    color: "white",
                                    cursor: "pointer",
                                    fontFamily: "Josefin Sans, sans-serif",
                                }}
                            >
                                Send
                            </button>
                        </div>

                        {!isLoggedIn && (
                            <p
                                style={{
                                    color: "#ff4d3d",
                                    fontSize: "13px",
                                    textAlign: "center",
                                    marginTop: 0,
                                    marginBottom: "10px",
                                }}
                            >
                                Only logged in users can review
                            </p>
                        )}
                        {/* Display reviews */}
                        {reviews.map((review, index) => (
                            <div key={index} style={reviewStyle(isMobile)}>
                                <img src={profile} alt="profile" style={reviewIconStyle(isMobile)} />
                                <span>{review}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const box = (isMobile) => ({
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.28)",
    borderRadius: isMobile ? "22px" : "24px",
    padding: isMobile ? "14px 16px" : "16px 18px",
    backdropFilter: "blur(12px)",
    boxSizing: "border-box",
});

const labelStyle = (isMobile) => ({
    margin: "0 0 8px 0",
    color: "#a55562",
    fontSize: isMobile ? "17px" : "18px",
    fontWeight: "600",
    textAlign: "center",
});

const valueStyle = (isMobile) => ({
    margin: 0,
    color: "#5b3b45",
    fontSize: "15px",
    textAlign: "center",
    lineHeight: 1.5,
});

const reviewStyle = (isMobile) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: isMobile ? "10px 12px" : "11px 13px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#8f4f5d",
    fontSize: "14px",
    marginBottom: "10px",
    wordBreak: "break-word",
});

const reviewIconStyle = (isMobile) => ({
    width: isMobile ? "30px" : "32px",
    height: isMobile ? "30px" : "32px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
});

export default ProductDetails;