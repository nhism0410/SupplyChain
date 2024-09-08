import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import heroGif from "../images/hihi.gif";
import "../Homepage/homepage.css";
import "../ProductList/ProductList";
import soldOutImage from "../images/4.png";
import "remixicon/fonts/remixicon.css";
import "../ProductList/productlist.css";
import categories from "../assets/categories.json";

const HomePage = ({ items, handleBuyItem, handleDeliverItem, onViewChange }) => {

      const [selectedCategory, setSelectedCategory] = useState("All");
    
      const shortenAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      };
    
      // Filter items by selected category
      const filteredItems =
        selectedCategory === "All"
          ? items
          : items.filter((item) => item.category === selectedCategory);
    

    return (
        <section className="hero__section">
            <Container>
                <Row>
                    <Col lg="6" md="6">
                        <div className="hero__content">
                            <h2>
                                Discover Models Marketplace{" "}
                                <span>Remarkable MARKET Treasures</span>
                            </h2>
                            <p>
                                Step into a world where every market item tells a unique story,
                                crafted with passion and ready for your exploration. Our
                                marketplace offers extraordinary finds, each with its own charm
                                and history. Begin your extraordinary journey today and
                                experience the magic of discovering one-of-a-kind treasures.
                            </p>
                            <div className="hero__btns d-flex align-items-center gap-4">
                                <button className="explore__btn d-flex align-items-center gap-2">
                                    <i className="ri-rocket-line"></i>
                                    Explore
                                </button>
                                <button
                                    className="create__btn d-flex align-items-center gap-2"
                                    onClick={() => onViewChange("addProduct")}
                                >
                                    <i className="ri-ball-pen-line"></i>
                                    Create
                                </button>
                            </div>
                        </div>
                    </Col>

                    <Col lg="6" md="6">
                        <div className="hero__gif">
                            <img src={heroGif} alt="Hero GIF" className="small-video" />
                        </div>
                    </Col>
                </Row>
            </Container>


        <div className="product-list-container">
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
                    <button className="create-button" onClick={() => handleBuyItem(item._id, item.cost)}>
                      Buy
             
                    </button>
                  )}
                  {item.status === "Purchased" && (
                    <button className="delivery-button" onClick={() => handleDeliverItem(item._id)}>
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

export default HomePage;
