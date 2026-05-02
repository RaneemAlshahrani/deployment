import Navbar from "../components/Navbar";
import Button from "../components/Button";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";
import logo from "../assets/bubble-logo.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../utils/auth";

const slideAnimation = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0px)  scale(1); }
  }
`;

function Home() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const isLoggedIn = !!userId;

  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [liked, setLiked] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const intervalRef = useRef(null);

  const isMobile = window.innerWidth <= 768;

  const product = products[currentIndex] || null;

  const getThemeColors = (theme) => ({
    background: "linear-gradient(135deg, #b45f69, #d8a0aa)",
    buttonColor: "#b84a57",
    buttonHover: "#9e3f4a",
    secondaryButtonColor: "#d99aa5",
    textColor: "#5a2d36",
    accentColor: "#d99aa5",
    dotActiveColor: "#8B3A52",
    dotInactiveColor: "rgba(139,58,82,0.3)",
    bubbleOpacity: 0.18,
    navBackground: "rgba(216, 160, 170, 0.3)",
    iconColor: "#5a2d36",
    iconHoverColor: "#9e3f4a"
  });

  const themeColors = getThemeColors(product?.theme);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.filter(i => !i.isCustomizable)))
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (products.length < 2) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length);
      setAnimKey(k => k + 1);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [products]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) return navigate("/");
    if (!product) return;

    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId,
          productId: product._id,
          quantity: 1
        })
      });

      setCartMessage("Added to cart");
      setTimeout(() => setCartMessage(""), 2000);
    } catch {
      alert("Failed to add product");
    }
  };

  const handleMoreDetails = () => {
    if (!isLoggedIn) return navigate("/");
    if (!product) return;
    navigate(`/product-details/${product._id}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: themeColors.background,
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{slideAnimation}</style>

      {/* Custom Navbar */}
      <nav style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "1000px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 22px",
        background: themeColors.navBackground,
        backdropFilter: "blur(12px)",
        borderRadius: "30px",
        zIndex: 100
      }}>
        <img src={logo} style={{ width: "95px", cursor: "pointer" }} onClick={() => navigate("/home")} />
      </nav>

      {/* Product */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "120px"
      }}>
        {product?.image && (
          <img
            key={animKey}
            src={product.image}
            style={{
              width: "90%",
              maxWidth: "560px",
              animation: "slideIn 0.6s ease"
            }}
          />
        )}

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
          position: "absolute",
          bottom: isMobile ? "40px" : "80px"
        }}>
          <Button text="Add to Cart" onClick={handleAddToCart} />
          <Button text="More Details" onClick={handleMoreDetails} />
        </div>
      </div>
    </div>
  );
}

export default Home;