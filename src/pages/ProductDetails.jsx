import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUserId, getCurrentUser } from "../utils/auth";
import Button from "../components/Button";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";
import profile from "../assets/profile-picture.png";

function ProductDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = getCurrentUserId();
    const currentUser = getCurrentUser();
    const isLoggedIn = !!userId;

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [addedToCart, setAddedToCart] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [liked, setLiked] = useState(false);

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
        setLoading(true);
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                // Reviews should come from backend, but for now use localStorage or empty array
                const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || data.reviews || [];
                setReviews(storedReviews);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!userId || !id) return;
        
        const checkWishlist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
                const data = await response.json();
                const exists = data.some((item) => item.productId?._id === id);
                setLiked(exists);
            } catch (error) {
                console.error(error);
            }
        };

        checkWishlist();
        window.addEventListener("wishlistUpdated", checkWishlist);
        return () => window.removeEventListener("wishlistUpdated", checkWishlist);
    }, [userId, id]);

    if (loading) {
        return (
            <div className="pink-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Loading product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pink-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
    const handleAddToCart = async () => {
        setAddedToCart(false);

        if (!isLoggedIn) {
            alert("Please login first");
            navigate("/");
            return;
        }

        if (product.stock <= 0) {
            alert("Out of stock");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    productId: product._id,
                    quantity: 1,
                }),
            });

            if (!response.ok) throw new Error("Failed to add to cart");

            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart");
        }
    };

    // Toggle wishlist
    const handleWishlistClick = async () => {
        if (!isLoggedIn) {
            alert("Please login first");
            navigate("/");
            return;
        }

        try {
            if (liked) {
                const response = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
                const data = await response.json();
                const wishlistItem = data.find(
                    (item) => item.productId?._id === product._id
                );
                if (wishlistItem) {
                    await fetch(`http://localhost:5000/api/wishlist/${wishlistItem._id}`, {
                        method: "DELETE",
                    });
                }
                setLiked(false);
            } else {
                await fetch("http://localhost:5000/api/wishlist", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        productId: product._id,
                        quantity: 1,
                    }),
                });
                setLiked(true);
            }
            window.dispatchEvent(new Event("wishlistUpdated"));
        } catch (error) {
            console.error(error);
            alert("Failed to update wishlist");
        }
    };

    // Add new review
    const handleSendReview = () => {
        if (!isLoggedIn) {
            alert("Please login first");
            return;
        }

        if (!reviewText.trim()) return;

        const newReview = {
            id: Date.now(),
            text: reviewText,
            userName: currentUser?.fullName || "User",
            userEmail: currentUser?.email || "",
            date: new Date().toLocaleDateString(),
        };

        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        
        // Save to localStorage (temp solution until backend review API is ready)
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
        
        setReviewText("");
        
        // Show success message
        const successMsg = document.createElement("div");
        successMsg.textContent = "Review added!";
        successMsg.style.cssText = "position:fixed;bottom:20px;right:20px;background:#39a86f;color:white;padding:10px 20px;border-radius:10px;z-index:1000";
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 2000);
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
                        <p style={labelStyle(isMobile)}>Reviews ({reviews.length})</p>

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
                                placeholder="Write your review..."
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
                                disabled={!reviewText.trim()}
                                style={{
                                    padding: isMobile ? "10px 12px" : "10px 14px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: reviewText.trim() ? "#8f4bd8" : "#ccc",
                                    color: "white",
                                    cursor: reviewText.trim() ? "pointer" : "not-allowed",
                                    fontFamily: "Josefin Sans, sans-serif",
                                    opacity: reviewText.trim() ? 1 : 0.6,
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
                                Please login to leave a review
                            </p>
                        )}
                        
                        {/* Display reviews */}
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={review.id || index} style={reviewStyle(isMobile)}>
                                    <img src={profile} alt="profile" style={reviewIconStyle(isMobile)} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                            <strong style={{ fontSize: "13px", color: "#5b3b45" }}>
                                                {review.userName || "Anonymous"}
                                            </strong>
                                            {review.date && (
                                                <span style={{ fontSize: "10px", color: "#999" }}>{review.date}</span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: "14px" }}>{review.text || review}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                                No reviews yet. Be the first to review this product!
                            </p>
                        )}
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
    alignItems: "flex-start",
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