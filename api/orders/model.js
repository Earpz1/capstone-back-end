import mongoose from 'mongoose'

const { Schema, model } = mongoose

const orderSchema = new Schema(
  {
    customerID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'usersModel',
    },
    restaurantID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'restaurantModel',
    },
    orderedItems: [
      {
        _id: false,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    deliveryFee: { type: Number },
    totalPrice: { type: Number },
    orderStatus: { type: String },
    reviewed: { type: Boolean },
  },
  {
    timestamps: true,
  },
)

export default model('ordersModel', orderSchema)
