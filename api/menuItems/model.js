import mongoose from 'mongoose'

const { Schema, model } = mongoose

const menuItemSchema = new Schema({
  restaurantID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'restaurantModel',
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, default: 'other' },
})
export default model('menuItemModel', menuItemSchema)
