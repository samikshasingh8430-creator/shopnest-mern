import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user || user.role !== "admin") {
      setError("Only administrators can add products.");
      return;
    }

    const productData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      productData.append(key, value);
    });

    if (image) {
      productData.append("imageUrl", image);
    }

    try {
      setLoading(true);
      const response = await fetch("/api/product/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: productData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add product.");
      }

      navigate("/admin/products");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="add-product">
      <div className="add-product__header">
        <p>Administration</p>
        <h1>Add product</h1>
      </div>

      <form className="add-product__form" onSubmit={handleSubmit}>
        <label htmlFor="name">Product name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          type="text"
          value={form.category}
          onChange={handleChange}
          required
        />

        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <label htmlFor="imageUrl">Product image</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files[0] || null)}
        />

        {error && <p role="alert">{error}</p>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Adding product..." : "Add product"}
        </button>
      </form>
    </section>
  );
};

export default AddProduct;
