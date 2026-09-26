import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
          throw new Error(
            data.message || "Unable to load dashboard statistics.",
          );
        }

        setStats(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, user]);

  const statCards = [
    { label: "Total orders", value: stats?.totalOrders ?? 0 },
    { label: "Total products", value: stats?.totalProducts ?? 0 },
    { label: "Total users", value: stats?.totalUsers ?? 0 },
    {
      label: "Total revenue",
      value: `₹${Number(stats?.totalRevenue || 0).toFixed(2)}`,
    },
  ];

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">Administration</p>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user.name || "Admin User"}</p>
        </div>
        <button className="btn" onClick={() => navigate("/admin/add-product")}>
          Add product
        </button>
      </div>

      <div className="admin-dashboard__grid">
        {statCards.map((card) => (
          <div className="admin-dashboard__card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="admin-dashboard__actions">
        <button className="btn" onClick={() => navigate("/admin/products")}>
          Manage products
        </button>
        <button className="btn" onClick={() => navigate("/admin/orders")}>
          Manage orders
        </button>
        <button className="btn" onClick={() => navigate("/admin/users")}>
          Manage users
        </button>
      </div>
    </section>
  );
};

export default AdminDashboard;
