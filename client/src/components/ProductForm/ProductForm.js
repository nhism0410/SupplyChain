// ProductForm.js
import React, { useState, useEffect } from 'react';
import categories from "../assets/categories.json";
import "../ProductForm/productform.css";

const ProductForm = ({ onSubmit, onInputChange }) => {
  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    console.log('Categories:', categories); // Debugging line
    setCategoryList(categories);
  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleFormSubmit = () => {
    // Call the onSubmit function with the category
    onSubmit(category);
  };

  return (
    <div className="product-form-page">
    <div className="formbg padding-horizontal--48 padding-top--48 padding-bottom--24">
      <h2 className="padding-bottom--24">ADD PRODUCT</h2>
      <div className="field padding-bottom--24">
        <label htmlFor="cost">Wei:</label>
        <input
          type="text"
          name="cost"
          onChange={onInputChange}
          className="input-field"
        />
      </div>
      <div className="field padding-bottom--24">
        <label htmlFor="itemName">Item Name:</label>
        <input
          type="text"
          name="itemName"
          onChange={onInputChange}
          className="input-field"
        />
      </div>
      <div className="field padding-bottom--24">
        <label htmlFor="category">Category:</label>
        <select
          name="category"
          value={category}
          onChange={handleCategoryChange}
          className="input-field"
        >
          <option value="">Select a category</option>
          {categoryList.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={handleFormSubmit}
        className="create-button"
      >
        Create
      </button>
    </div>
    </div>
  );
};

export default ProductForm;
