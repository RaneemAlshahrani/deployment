import { useEffect, useState } from "react";
import userProfile from "../assets/profile-picture.png";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/reviewManagement.css";

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // ✅ FETCH REVIEWS FROM BACKEND
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/reviews");
      const data = await res.json();

      setReviews(data);

      // set first product automatically
      if (data.length > 0) {
        setSelectedProductId(data[0].productId?._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ GET UNIQUE PRODUCTS FROM REVIEWS
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

  // ✅ FILTER REVIEWS FOR SELECTED PRODUCT
  const selectedReviews = reviews.filter(
    (r) => r.productId?._id === selectedProductId
  );

  const selectedProduct = products.find(
    (p) => p.id === selectedProductId
  );

  // ✅ DELETE FLOW
  const triggerDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/reviews/${reviewToDelete}`,
        { method: "DELETE" }
      );

      setReviews((prev) =>
        prev.filter((r) => r._id !== reviewToDelete)
      );
    } catch (err) {
      console.error(err);
    }

    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  return (
    <div className="purple-page review-page">
      {/* MODAL */}
      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <h3 className="msg-red">Delete Review?</h3>
            <p>This action cannot be undone.</p>

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
          {/* PRODUCTS */}
          <div className="products-panel">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {product.image && (
                  <img src={product.image} alt={product.name} />
                )}

                <h3>{product.name}</h3>

                <button
                  className={
                    selectedProductId === product.id
                      ? "reviews-btn active-review-btn"
                      : "reviews-btn"
                  }
                  onClick={() => setSelectedProductId(product.id)}
                >
                  Reviews
                </button>
              </div>
            ))}
          </div>

          {/* REVIEWS */}
          <div className="reviews-panel">
            <h2>{selectedProduct?.name || "Product"} Reviews</h2>

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
                      <span className="review-user-name">
                        {review.userName}
                      </span>

                      <p>{review.text}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerDelete(review._id)}
                    className="delete-review-btn"
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