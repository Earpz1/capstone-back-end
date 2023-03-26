import mongoose from 'mongoose'

const { Schema, model } = mongoose

const restaurantSchema = new Schema({
  ownerID: { type: Schema.Types.ObjectId, required: true, ref: 'usersModel' },
  name: { type: String },
  address: { type: String },
  cuisine: { type: String },
  minimumOrder: { type: Number },
  deliveryFee: { type: Number },
  foodCategories: { type: [String] },
})

export default model('restaurantModel', restaurantSchema)
