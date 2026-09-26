import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import "../styles/productCard.css";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const isInCart = cartItems.some((item) => (item.productId || item._id) === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCartAction = () => {
    if (!product) {
      return;
    }

    if (isInCart) {
      dispatch(removeFromCart(product._id));
      return;
    }

    if (product.stock > 0) {
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrls,
          qty: 1,
        })
      );

      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          margin: "100px",
          color: "#ef4444",
        }}
      >
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          textAlign: "center",
          margin: "100px",
          color: "#ef4444",
        }}
      >
        Product Not Found
      </div>
    );
  }

  return (
    <div
      className="product-detail-wrapper"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          color: "#a1a1aa",
          marginBottom: "20px",
          fontSize: "0.95rem",
        }}
      >
        <Link to="/" style={{ color: "#f97316" }}>
          Home
        </Link>{" "}
        /{" "}
        <Link to="/shop" style={{ color: "#f97316" }}>
          Shop
        </Link>{" "}
        / {product.category} /{" "}
        <span style={{ color: "#fff" }}>{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="product-detail">

        {/* Left Side - Image */}
        <div className="detail-image-container">
          <img
            src={product.imageUrls}
            alt={product.name}
            className="detail-image"
          />
        </div>

        {/* Right Side - Product Information */}
        <div className="detail-info">

          <h2
            style={{
              fontSize: "2.8rem",
              marginBottom: "10px",
            }}
          >
            {product.name}
          </h2>

          <p
            className="detail-price"
            style={{
              fontSize: "2.5rem",
              margin: "15px 0",
            }}
          >
            ₹{Number(product.price).toFixed(2)}
          </p>

          {/* Description */}
          <div style={{ marginBottom: "25px" }}>
            <h4
              style={{
                color: "#fff",
                marginBottom: "10px",
              }}
            >
              Product Description
            </h4>

            <p>{product.description}</p>
          </div>

          {/* Cart Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <button
              onClick={handleCartAction}
              className="btn"
              disabled={!isInCart && product.stock <= 0}
              style={{
                flexGrow: "1",
                padding: "18px",
                fontSize: "1.2rem",
                cursor: isInCart || product.stock > 0 ? "pointer" : "not-allowed",
                opacity: isInCart || product.stock > 0 ? 1 : 0.5,
              }}
            >
              {isInCart
                ? "Remove from Cart"
                : product.stock > 0
                  ? "Add to Shopping Cart"
                  : "Out of Stock"}
            </button>
          </div>

          {/* Stock Status */}
          <p
            style={{
              marginTop: "20px",
              color:
                product.stock > 0 ? "#10b981" : "#ef4444",
              fontWeight: "600",
            }}
          >
            {product.stock > 0
              ? `* In Stock (${product.stock} units available)`
              : "* Temporarily Out of Stock"}
          </p>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;