import express from 'express'
import createHttpError from 'http-errors'
import {
  createAccessToken,
  JWTMiddleware,
  OwnerMiddleware,
} from '../../lib/tools.js'
import menuItemsModel from '../menuItems/model.js'

const menuItemsRouter = express.Router()

//Create a new menu item
menuItemsRouter.post(
  '/newItem',
  JWTMiddleware,
  async (request, response, next) => {
    try {
      const newItem = new menuItemsModel(request.body)
      const { _id } = await newItem.save()

      response.status(200).send(newItem)
    } catch (error) {
      console.log(error)
      next()
    }
  },
)

menuItemsRouter.get('/getAllItems', async (request, response, next) => {
  try {
    const menuItems = await menuItemsModel.find({})
    response.status(200).send(menuItems)
  } catch (error) {
    next()
  }
})

menuItemsRouter.delete('/deleteItem/:id', async (request, response, next) => {
  const id = request.params.id
  console.log(id)
  try {
    const menuItem = await menuItemsModel.findByIdAndDelete(id)
    response.status(200).send({ message: 'Item deleted' })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//Get all menu items belonging to a restaurant
menuItemsRouter.get('/:restaurantID', async (request, response, next) => {
  try {
    const id = request.params.restaurantID
    const menuItems = await menuItemsModel.find({ restaurantID: id })

    response.status(200).send(menuItems)
  } catch (error) {
    console.log(error)
    next()
  }
})

//Get all menu items for a specific category
menuItemsRouter.get(
  '/:restaurantID/:category',
  async (request, response, next) => {
    try {
      const id = request.params.restaurantID
      const category = request.params.category
      const menuItems = await menuItemsModel.find({
        restaurantID: id,
        category: category,
      })

      response.status(200).send(menuItems)
    } catch (error) {
      console.log(error)
      next()
    }
  },
)

export default menuItemsRouter
