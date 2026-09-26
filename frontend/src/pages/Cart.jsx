import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, addToCart } from "../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );

  const updateQuantity = (item, quantity) => {
    const itemId = item.productId || item._id;

    if (quantity <= 0) {
      dispatch(removeFromCart(itemId));
      return;
    }

    dispatch(addToCart({ ...item, qty: quantity }));
  };

  if (cartItems.length === 0) {
    return (
      <section className="cart-container cart-empty">
        <h1>Shopping Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-container">
      <div className="cart-header">
        <h1> Shopping Cart</h1>
        <button
          type="button"
          className="btn"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {cartItems.map((item) => {
          const itemId = item.productId || item._id;
          const quantity = Number(item.qty || 1);

          return (
            <article key={itemId} className="cart-item">
              <img
                src={item.imageUrl || item.imageUrls}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <h2>{item.name}</h2>
                <p>
                  ₹{Number(item.price || 0).toFixed(2)} × {quantity}
                </p>
                <p>
                  Item total: ₹{(Number(item.price || 0) * quantity).toFixed(2)}
                </p>
                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item, quantity - 1)}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item, quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(itemId))}
                  className="remove-item-button"
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="cart-summary">
        <h2>Subtotal: ₹{subtotal.toFixed(2)}</h2>
        <button
          type="button"
          className="btn checkout-button"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
};

export default Cart;
