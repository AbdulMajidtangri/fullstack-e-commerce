const { Schema, model, Types } = require('mongoose');

const productSchema = new Schema({
  Name: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  user: { type: Types.ObjectId, ref: 'user' } // Reference to the user who created the product
}, { timestamps: true });

module.exports = model("product", productSchema);