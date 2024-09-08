// src/components/Main.js
import React from "react";
import SiteNavbar from "../SiteNavbar/SiteNavbar";
import ProductForm from "../ProductForm/ProductForm";
import ProductList from "../ProductList/ProductList";
import Homepage from "../Homepage/HomePage";
import Footer from "../Footer/Footer";

const Main = ({
  currentView,
  items,
  onSubmit,
  onInputChange,
  onViewChange,
  handleBuyItem,
  handleDeliverItem,
  account,
}) => {
  return (
    <div>
      {/* Header */}
      <SiteNavbar onViewChange={onViewChange} account={account} />

      {/* Body */}
      <div className="main-content">
        {currentView === "home" && (
          <Homepage
            items={items}
            handleBuyItem={handleBuyItem}
            handleDeliverItem={handleDeliverItem}
            onViewChange={onViewChange}
          />
        )}
        {currentView === "addProduct" && (
          <ProductForm onSubmit={onSubmit} onInputChange={onInputChange} />
        )}
        {currentView === "productList" && (
          <ProductList
            items={items}
            handleBuyItem={handleBuyItem}
            handleDeliverItem={handleDeliverItem}zz
          />
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Main;
