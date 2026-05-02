import { useEffect, useState } from "react";
import userProfile from "../assets/profile-picture.png";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/reviewManagement.css";
import { getAuthToken } from "../utils/auth";

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // FETCH REVIEWS FROM BACKEND
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/admin/reviews", {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      setReviews(data);

      // set first product automatically
      if (data.length > 0) {
        setSelectedProductId(data[0].productId?._id);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // GET UNIQUE PRODUCTS FROM REVIEWS
  const products = [
    ...new Map(
      reviews.map((r) => [
        r.productId?._id,
        {
          id: r.productId?._id,
          name: r.productId?.name,
          image: r.productId?.image,
        },
      ])
    ).values(),
  ];

  // FILTER REVIEWS FOR SELECTED PRODUCT
  const selectedReviews = reviews.filter(
    (r) => r.productId?._id === selectedProductId
  );

  const selectedProduct = products.find(
    (p) => p.id === selectedProductId
  );

  // DELETE FLOW
  const triggerDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = getAuthToken();
      await fetch(
        `http://localhost:5000/api/admin/reviews/${reviewToDelete}`,
        { 
          method: "DELETE",
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        }
      );

      setReviews((prev) =>
        prev.filter((r) => r._id !== reviewToDelete)
      );
      setMessage("Review deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete review");
    }

    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const getAverageRating = (productId) => {
    const productReviews = reviews.filter(r => r.productId?._id === productId);
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / productReviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="purple-page review-page">
        <div className="review-layout">
          <AdminSidebar activePage="reviews" />
          <div style={{ textAlign: "center", padding: "50px" }}>
            Loading reviews...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="purple-page review-page">
      {/* MODAL */}
      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <h3 className="msg-red">Delete Review?</h3>
            <p>Are you sure you want to delete this review?</p>
            <p style={{ fontSize: "14px", color: "#666" }}>This action cannot be undone.</p>

            <div className="modal-actions-split">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="delete-btn-final"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="review-layout">
        <AdminSidebar activePage="reviews" />

        <div className="review-main">
          {/* Message display */}
          {message && (
            <div style={{
              background: message.includes("success") ? "rgba(57,168,111,0.2)" : "rgba(255,77,109,0.2)",
              color: message.includes("success") ? "#39a86f" : "#ff4d6d",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "16px",
              textAlign: "center"
            }}>
              {message}
            </div>
          )}

          {/* PRODUCTS PANEL */}
          <div className="products-panel">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  {product.image && (
                    <img 
                      src={product.image?.startsWith("http") ? product.image : product.image} 
                      alt={product.name} 
                      style={{ width: "100px", height: "100px", objectFit: "contain" }}
                    />
                  )}

                  <h3>{product.name}</h3>
                  
                  {/* Rating stars */}
                  <div style={{ marginBottom: "8px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} style={{
                        color: star <= (getAverageRating(product.id) || 0) ? "#ffc107" : "#e0e0e0",
                        fontSize: "16px"
                      }}>
                        ★
                      </span>
                    ))}
                    <span style={{ fontSize: "12px", marginLeft: "5px", color: "#666" }}>
                      ({getAverageRating(product.id)})
                    </span>
                  </div>

                  <button
                    className={
                      selectedProductId === product.id
                        ? "reviews-btn active-review-btn"
                        : "reviews-btn"
                    }
                    onClick={() => setSelectedProductId(product.id)}
                    style={{
                      background: selectedProductId === product.id ? "#8f4bd8" : "rgba(255,255,255,0.2)",
                      color: selectedProductId === product.id ? "white" : "#2e3d4c",
                    }}
                  >
                    View Reviews ({reviews.filter(r => r.productId?._id === product.id).length})
                  </button>
                </div>
              ))
            ) : (
              <div className="empty" style={{ textAlign: "center", width: "100%" }}>
                No products with reviews found.
              </div>
            )}
          </div>

          {/* REVIEWS PANEL */}
          <div className="reviews-panel">
            <h2>{selectedProduct?.name || "Product"} Reviews</h2>
            <p style={{ color: "#666", marginBottom: "16px" }}>
              Total reviews: {selectedReviews.length}
            </p>

            {selectedReviews.length > 0 ? (
              selectedReviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-left">
                    <img
                      src={userProfile}
                      alt={review.userName}
                      className="review-user-img"
                    />

                    <div className="review-text-box">
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span className="review-user-name">
                          {review.userName || review.user?.fullName || "Anonymous"}
                        </span>
                        
                        {/* Rating stars for this review */}
                        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{
                              color: star <= (review.rating || 0) ? "#ffc107" : "#e0e0e0",
                              fontSize: "12px"
                            }}>
                              ★
                            </span>
                          ))}
                        </div>
                        
                        {review.date && (
                          <span style={{ fontSize: "11px", color: "#999" }}>
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <p style={{ marginTop: "8px" }}>{review.text}</p>
                      
                      {review.userEmail && (
                        <p style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                          {review.userEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => triggerDelete(review._id)}
                    className="delete-review-btn"
                    title="Delete review"
                  >
                    🗑
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">
                No reviews found for this product.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewManagement;