import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Only administrators can view products.");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load products.");
        }

        setProducts(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleDelete = async (productId) => {
    const shouldDelete = window.confirm("Delete this product?");

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete product.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== productId),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error && products.length === 0) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className="admin-products">
      <div className="admin-products__header">
        <div>
          <p className="admin-products__eyebrow">Administration</p>
          <h1>Manage Products</h1>
        </div>
        <Link className="btn" to="/admin/add-product">
          + Add Product
        </Link>
      </div>

      {error && <p role="alert">{error}</p>}

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="admin-products__table-wrapper">
          <table className="admin-products__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="admin-products__id" title={product._id}>
                    {product._id.slice(-8)}...
                  </td>
                  <td>{product.name}</td>
                  <td>₹{Number(product.price || 0).toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td className="admin-products__actions">
                    <Link
                      className="admin-products__edit"
                      to={`/admin-edit-products/${product._id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="admin-products__delete"
                      type="button"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
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

export default AdminProducts;
