import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const orderStatuses = ["pending", "shipped", "delivered"];

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Only administrators can view orders.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders.");
        }

        setOrders(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update order status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error && orders.length === 0) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className="admin-orders">
      <div className="admin-orders__header">
        <p className="admin-orders__eyebrow">Administration</p>
        <h1>Manage Orders</h1>
      </div>

      {error && <p role="alert">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="admin-orders__table-wrapper">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="admin-orders__id" title={order.orderId}>
                    {order.orderId?.slice(-8) || order._id.slice(-8)}...
                  </td>
                  <td>{order.user?.name || "Unknown user"}</td>
                  <td>₹{Number(order.totalAmount || 0).toFixed(2)}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <select
                      className={`admin-orders__status admin-orders__status--${order.status}`}
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order._id, event.target.value)
                      }
                    >
                      {orderStatuses.map((status) => (
                        <option value={status} key={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
