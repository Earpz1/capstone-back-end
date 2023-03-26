import express from 'express'
import createHttpError from 'http-errors'
import { createAccessToken, JWTMiddleware } from '../../lib/tools.js'

const reviewsRouter = express.Router()

reviewsRouter.get('/:restaurantID', async (request, response, next) => {
  try {
    const reviews = await reviewsModel.find({
      restaurantID: request.params.restaurantID,
    })
    if (reviews) {
      response.send(reviews)
    } else {
      next(
        createHttpError(
          404,
          `Reviews with restaurantID ${request.params.restaurantID} not found!`,
        ),
      )
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.post(
  '/:restaurantID',
  JWTMiddleware,
  async (request, response, next) => {
    try {
      const newReview = new reviewsModel(request.body)
      const { _id } = await newReview.save()
      response.status(201).send({ _id })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
)

reviewsRouter.get('/:reviewID', async (request, response, next) => {
  try {
    const review = await reviewsModel.findById(request.params.reviewID)
    if (review) {
      response.send(review)
    } else {
      next(
        createHttpError(
          404,
          `Review with ID ${request.params.reviewID} not found!`,
        ),
      )
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default reviewsRouter
