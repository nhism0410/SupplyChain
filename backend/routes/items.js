const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new item
// routes/items.js
router.post('/add', async (req, res) => {
  const { name, cost, category, fromAddress, toAddress, itemAddress, hash, status, contractIndex } = req.body;

  // Check for missing fields
  if (!name || !cost || !category || !fromAddress || !toAddress || !itemAddress || !hash || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newItem = new Item({
      name,
      cost,
      category, // Add category here
      fromAddress,
      toAddress,
      itemAddress,
      hash,
      status,
      contractIndex
    });

    const savedItem = await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: savedItem });
  } catch (error) {
    console.error('Error adding item:', error.message); // Log the error message
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST update item status
router.post('/update', async (req, res) => {
  try {
    const { index, status, category } = req.body;

    // Find the item by ID and update its status and category
    const updatedItem = await Item.findByIdAndUpdate(index, { status, category }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// POST update item status
router.post('/update', async (req, res) => {
  try {
    const { index, status } = req.body;

    // Find the item by ID and update its status
    const updatedItem = await Item.findByIdAndUpdate(index, { status }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
