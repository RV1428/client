import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  const handleReviewSubmit = (productId, review) => {
    axios
      .post(`http://localhost:5000/api/products/${productId}/review`, review)
      .then((response) => {
        const updatedProducts = products.map((product) =>
          product._id === productId ? response.data : product
        );
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to submit review");
      });
  };

  const handleAddProduct = () => {
    axios
      .post("http://localhost:5000/api/products", newProduct)
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProduct({ name: "", description: "", image: "" });
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to add product");
      });
  };

  const handleProductDelete = (productId) => {
    axios
      .delete(`http://localhost:5000/api/products/${productId}`)
      .then((response) => {
        const updatedProducts = products.filter(
          (product) => product._id !== productId
        );
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error(`Error deleting product with ID ${productId}:`, error);
        setError("Failed to delete product");
      });
  };

  return (
    <div className="outer-cont">
      <h1>Product Review Platform</h1>
      <div className="add-container">
      <div className="product-card">
        <h3>Add a New Product:</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddProduct();
          }}
        >
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              required
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              name="image"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
              required
            />
          </label>
          <button className="add-btn" type="submit">
            Add Product
          </button>
        </form>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="cards">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleProductDelete}
              onReviewSubmit={handleReviewSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product, onDelete, onReviewSubmit }) => {
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const user = e.target.elements.user.value;
    const rating = e.target.elements.rating.value;
    const comment = e.target.elements.comment.value;
    onReviewSubmit(product._id, { user, rating, comment });
  };

  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      {/* <button className="delete-btn" onClick={() => onDelete(product._id)}>
        Delete Product
      </button> */}
      {/* <button className="delete-btn" onClick={() => onDelete(product._id)}>
        <img src="https://static-00.iconduck.com/assets.00/delete-icon-1864x2048-bp2i0gor.png" className="img-delete"/>
      </button> */}
      <img src={product.image} style={{ width: "300px" }} alt={product.name} className="img-card" />
      <p>{product.description}</p>
      <h3>Reviews:</h3>
      <ul>
        {product.reviews.map((review, index) => (
          <li key={index}>
            <strong>{review.user}</strong> - {review.rating}/5:{" "}
            {review.comment}
          </li>
        ))}
      </ul>
      <h3>Add a Review:</h3>
      <form onSubmit={handleReviewSubmit}>
        <label>
          User:
          <input type="text" name="user" required />
        </label>
        <label>
          Rating:
          <input type="number" name="rating" min="1" max="5" required />
        </label>
        <label>
          Comment:
          <textarea name="comment" required></textarea>
        </label>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default App;
