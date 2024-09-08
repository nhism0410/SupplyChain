const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  cost: { 
    type: Number, 
    required: true 
  },
  fromAddress: { 
    type: String, 
    required: true 
  },
  toAddress: { 
    type: String, 
    required: true 
  },
  itemAddress: { 
    type: String, 
    required: true 
  },
  hash: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String,
    enum: ['Create', 'Paid', 'Delivered'],
    required: true 
  },
  contractIndex: { type: Number },
  category: { type: String },
   // Thêm danh mục sản phẩm
}, 
{ 
  timestamps: true 
});

module.exports = mongoose.model('Item', ItemSchema);
