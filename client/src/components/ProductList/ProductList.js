import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "../ProductList/productlist.css";
import soldOutImage from "../images/4.png";
import categories from "../assets/categories.json";

const ProductList = ({ items, handleBuyItem, handleDeliverItem }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Filter items by selected category and search query (excluding itemAddress)
  const filteredItems = items
    .filter((item) =>
      selectedCategory === "All" ? true : item.category === selectedCategory
    )
    .filter((item) =>
      // Search across name, cost, and status only
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cost.toString().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section className="hero__section">
      <div className="product-list-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <FaSearch className="search-icon" />
          {searchQuery && (
            <FaTimes className="clear-icon" onClick={clearSearch} />
          )}
        </div>
        <h2>Existing Items</h2>
        {/* Category Filter with Buttons */}
        <div className="filter-container">
          <button
            className={`category-button ${
              selectedCategory === "All" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${
                selectedCategory === category.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="product-cards">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div className="product-card" key={item._id}>
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p>Cost: {item.cost} Wei</p>
                  <p>Status: {item.status}</p>
                  <p className="shortened-address">
                    Item Address: {shortenAddress(item.itemAddress)}
                  </p>
                </div>
                <div className="product-actions">
                  {item.status === "Create" && (
                    <button
                      className="create-button"
                      onClick={() => handleBuyItem(item._id, item.cost)}
                    >
                      Buy
                    </button>
                  )}
                  {item.status === "Purchased" && (
                    <button
                      className="delivery-button"
                      onClick={() => handleDeliverItem(item._id)}
                    >
                      Deliver
                    </button>
                  )}
                  {item.status === "Delivered" && (
                    <div className="sold-out-badge">
                      <img src={soldOutImage} alt="Sold Out" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No items found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
