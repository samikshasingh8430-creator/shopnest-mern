import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <section
      className="cart-container cart-empty"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div
        style={{
          maxWidth: "620px",
          margin: "0 auto",
          padding: "40px 24px",
          background: "#18181b",
          border: "1px solid rgba(16, 185, 129, 0.35)",
          borderRadius: "16px",
        }}
      >
        <div
          style={{ fontSize: "56px", color: "#10b981", marginBottom: "16px" }}
        >
          ✓
        </div>
        <h1>Order Successful!</h1>
        <p style={{ margin: "16px 0 28px", color: "#d4d4d8" }}>
          Thank you for your purchase. Your payment has been received.
        </p>
        <Link to="/shop" className="btn">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
};

export default OrderSuccess;
