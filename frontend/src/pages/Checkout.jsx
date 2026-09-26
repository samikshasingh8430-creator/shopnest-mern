import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );

  const handlePayment = async () => {
    setError("");

    if (cartItems.length === 0 || total <= 0) {
      setError("Your cart is empty.");
      return;
    }

    const hasEmptyField = Object.values(address).some((value) => !value.trim());
    if (hasEmptyField) {
      setError("Please complete your shipping address.");
      return;
    }

    if (!/^\+?[0-9\s-]{7,15}$/.test(address.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!/^\d{4,10}$/.test(address.postalCode.trim())) {
      setError("Please enter a valid postal code.");
      return;
    }

    const token = user?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    setIsPaying(true);

    try {
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error("Payment service could not be loaded.");
      }

      const orderResponse = await fetch("/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: total, address }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Could not create payment order.");
      }

      const payment = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopNest",
        description: "Order payment",
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed.",
              );
            }

            const createOrderResponse = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                items: cartItems.map((item) => ({
                  productId: item.productId || item._id,
                  qty: Number(item.qty || 1),
                  price: Number(item.price || 0),
                })),
                totalAmount: total,
                address,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
              }),
            });

            const createdOrder = await createOrderResponse.json();
            if (!createOrderResponse.ok) {
              throw new Error(
                createdOrder.message || "Could not save your order.",
              );
            }

            dispatch(clearCart());
            navigate("/order-success");
          } catch (verificationError) {
            setError(verificationError.message);
          } finally {
            setIsPaying(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#f97316" },
      });

      payment.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setIsPaying(false);
      });

      payment.open();
    } catch (paymentError) {
      setError(paymentError.message);
      setIsPaying(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePayment();
  };

  if (cartItems.length === 0) {
    return (
      <section className="cart-container cart-empty">
        <h1>Shopping Address</h1>
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-container">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h1>Shopping Address</h1>

        <div className="shipping-form">
          <div className="shipping-form-grid">
            <label>
              Full Name
              <input
                name="fullName"
                type="text"
                value={address.fullName}
                onChange={(event) =>
                  setAddress({ ...address, fullName: event.target.value })
                }
                placeholder="Enter your full name"
                required
              />
            </label>

            <label>
              Phone Number
              <input
                name="phone"
                type="tel"
                value={address.phone}
                onChange={(event) =>
                  setAddress({ ...address, phone: event.target.value })
                }
                placeholder="Enter your phone number"
                required
              />
            </label>

            <label>
              Street Address
              <input
                name="street"
                type="text"
                value={address.street}
                onChange={(event) =>
                  setAddress({ ...address, street: event.target.value })
                }
                placeholder="House number and street"
                required
              />
            </label>

            <label>
              City
              <input
                name="city"
                type="text"
                value={address.city}
                onChange={(event) =>
                  setAddress({ ...address, city: event.target.value })
                }
                placeholder="Enter your city"
                required
              />
            </label>

            <label>
              Postal Code
              <input
                name="postalCode"
                type="text"
                value={address.postalCode}
                onChange={(event) =>
                  setAddress({ ...address, postalCode: event.target.value })
                }
                placeholder="Enter postal code"
                inputMode="numeric"
                required
              />
            </label>

            <label>
              Country
              <input
                name="country"
                type="text"
                value={address.country}
                onChange={(event) =>
                  setAddress({ ...address, country: event.target.value })
                }
                placeholder="Enter your country"
                required
              />
            </label>
          </div>
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div className="checkout-item" key={item.productId || item._id}>
              <span>
                {item.name} × {Number(item.qty || 1)}
              </span>
              <strong>
                ₹{(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
              </strong>
            </div>
          ))}

          <div className="checkout-total">
            <span>Total Payable</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button
            type="submit"
            className="btn checkout-pay-button"
            disabled={isPaying}
          >
            {isPaying ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
