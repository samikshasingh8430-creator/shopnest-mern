import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!user?.token) {
      setOrdersLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load order history.");
        }
        if (!Array.isArray(data)) {
          throw new Error("Invalid order history response.");
        }

        setOrders(data);
      } catch (error) {
        setOrdersError(error.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <section className="profile-container profile-empty">
        <h1>My Profile</h1>
        <p>Please log in to view your profile.</p>
        <Link to="/login" className="btn">
          Login
        </Link>
      </section>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {(user.name || "U").charAt(0).toUpperCase()}
        </div>
        <h1>{user.name || "User Profile"}</h1>

        <div className="profile-details">
          <div>
            <span>Email</span>
            <strong>{user.email || "Not available"}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{user.role || "Customer"}</strong>
          </div>
        </div>

        <button type="button" className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="order-history">
        <h2>Order History</h2>

        {ordersLoading && <p>Loading orders...</p>}
        {!ordersLoading && ordersError && (
          <p className="orders-error">{ordersError}</p>
        )}
        {!ordersLoading && !ordersError && orders.length === 0 && (
          <p>No orders found.</p>
        )}

        {!ordersLoading &&
          !ordersError &&
          orders.map((order) => (
            <article className="order-history-item" key={order._id}>
              <div className="order-history-heading">
                <strong>{order.orderId}</strong>
                <span className={`order-status status-${order.status}`}>
                  {order.status}
                </span>
              </div>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                {order.items.length} item{order.items.length === 1 ? "" : "s"}
                <span> | </span>
                <strong>₹{Number(order.totalAmount).toFixed(2)}</strong>
              </p>
              <div className="order-history-products">
                {order.items.map((item) => (
                  <p key={item._id}>
                    {item.productId?.name || "Product"} × {item.qty}
                  </p>
                ))}
              </div>
              {order.address && (
                <p className="order-history-address">
                  Deliver to: {order.address.street}, {order.address.city},{" "}
                  {order.address.postalCode}, {order.address.country}
                </p>
              )}
            </article>
          ))}
      </div>
    </section>
  );
};

export default Profile;
