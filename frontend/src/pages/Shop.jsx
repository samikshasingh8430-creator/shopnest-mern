import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Shop = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get("search") || "";

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await fetch("/api/product");

				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}

				const data = await res.json();
				setProducts(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error("Error fetching products:", err);
				setError("Unable to load products. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const filteredProducts = products.filter((product) => {
		const searchValue = searchTerm.trim().toLowerCase();
		return (
			!searchValue ||
			product.name.toLowerCase().includes(searchValue) ||
			product.category.toLowerCase().includes(searchValue)
		);
	});

	const handleSearchChange = (value) => {
		const nextParams = new URLSearchParams(searchParams);
		if (value.trim()) {
			nextParams.set("search", value);
		} else {
			nextParams.delete("search");
		}
		setSearchParams(nextParams, { replace: true });
	};

	return (
		<section className="shop-container">
			<div className="shop-heading">
				<h1>All Products</h1>
				<label className="shop-search">
					<span className="shop-search__label">Search products</span>
					<span className="shop-search__icon" aria-hidden="true">&#128269;</span>
					<input
						type="search"
						value={searchTerm}
						onChange={(event) => handleSearchChange(event.target.value)}
						placeholder="Search by name or category"
					/>
					{searchTerm && (
						<button
							type="button"
							className="shop-search__clear"
							onClick={() => handleSearchChange("")}
							aria-label="Clear product search"
						>
							×
						</button>
					)}
				</label>
			</div>

			{loading && <p>Loading products...</p>}

			{!loading && error && <p>{error}</p>}

			{!loading && !error && products.length === 0 && (
				<p>No products are available right now.</p>
			)}

			{!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
				<p className="shop-empty">No products match your search.</p>
			)}

			{!loading && !error && filteredProducts.length > 0 && (
					<div className="product-grid">
						{filteredProducts.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			)}
		</section>
	);
};

export default Shop;
