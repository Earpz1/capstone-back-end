import mongoose from 'mongoose'

const { Schema, model } = mongoose

const reviewSchema = new Schema({
  restaurantID: { type: Schema.Types.ObjectId, required: true, ref: 'restaurantModel' },
  rating: { type: Number },
  comments: { type: String },
},
{
    timestamps: true,
})

export default model('reviewModel', reviewSchema)
