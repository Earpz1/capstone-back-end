import express from 'express'
import createHttpError from 'http-errors'
import restaurantModel from './model.js'
import usersModel from '../users/model.js'
import { JWTMiddleware, OwnerMiddleware } from '../../lib/tools.js'

const restaurantRouter = express.Router()

//Create a restaurant
restaurantRouter.post(
  '/create',
  JWTMiddleware,
  async (request, response, next) => {
    try {
      console.log(request.user)
      const newRestaurant = new restaurantModel(request.body)
      newRestaurant.ownerID = request.user.id
      const { _id } = await newRestaurant.save()

      const updateUser = await usersModel.findByIdAndUpdate(
        request.user.id,
        { restaurantID: { _id } },
        { new: true },
      )

      response.status(200).send({ message: 'Restaurant Created' })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
)

//Get the restaurant belonging to an owner
restaurantRouter.get(
  '/getRestaurant',
  JWTMiddleware,
  async (request, response, next) => {
    try {
      const restaurant = await restaurantModel.findOne({
        ownerID: request.user.id,
      })
      response.status(200).send(restaurant)
    } catch (error) {
      next()
    }
  },
)

//Return all the categories of food in the Menu
restaurantRouter.get(
  '/getMenuCategories',
  JWTMiddleware,
  async (request, response, next) => {
    try {
      const restaurant = await restaurantModel.findOne({
        ownerID: request.user.id,
      })
      response.status(200).send(restaurant.foodCategories)
    } catch (error) {
      next()
    }
  },
)

//Edit a menu category (If it exists, delete it. If it doesn't exist, add it)
restaurantRouter.put(
  '/deleteMenuCategory/:category',
  JWTMiddleware,
  OwnerMiddleware,
  async (request, response, next) => {
    try {
      const category = request.params.category

      const restaurant = await restaurantModel.findOne({
        ownerID: request.user.id,
      })
      const index = restaurant.foodCategories.indexOf(category)
      if (index !== -1) {
        const newArray = restaurant.foodCategories.splice(index, 1)
        const updatedCategories = await restaurantModel.findOneAndUpdate(
          { ownerID: request.user.id },
          restaurant,
          { new: true },
        )
        response.status(200).send(updatedCategories)
      } else {
        const newArray = restaurant.foodCategories.push(category)
        const addCategory = await restaurantModel.findOneAndUpdate(
          { ownerID: request.user.id },
          restaurant,
          { new: true },
        )
        response.status(200).send(addCategory)
      }
    } catch (error) {
      console.log(error)
      next()
    }
  },
)

//Return the results of a city search

restaurantRouter.get('/search/:city', async (request, response, next) => {
  try {
    const restaurant = await restaurantModel.find({
      address: request.params.city,
    })
    response.status(200).send(restaurant)
  } catch (error) {
    next()
  }
})

//Edit the details of a restaurant
restaurantRouter.put(
  '/editDetails',
  JWTMiddleware,
  OwnerMiddleware,
  async (request, response, next) => {
    try {
      const restaurant = await restaurantModel.findOneAndUpdate(
        { ownerID: request.user.id },
        request.body,
        { new: true },
      )

      response.status(200).send(restaurant)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
)

//Get the details of a restaurant from an ID
restaurantRouter.get('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const restaurant = await restaurantModel.findById(id)

    response.status(200).send(restaurant)
  } catch (error) {
    console.log(error)
    next()
  }
})

export default restaurantRouter
