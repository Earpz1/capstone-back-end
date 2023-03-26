import express from 'express'
import createHttpError from 'http-errors'
import { JWTMiddleware, OwnerMiddleware } from '../../lib/tools.js'
import ordersModel from './model.js'
import Stripe from 'stripe'

const stripe = new Stripe(
  'sk_test_51Mnjs0FvNVztANBAi4IUu3o5pOvdWpAVoeRt5b3ozAotVWr2yrl3RVPSLrbbGcIhYP1RXeJx4OyGvZXT4ZSWEFLZ00ExdIvB71',
)

const ordersRouter = express.Router()

//Create a new order

ordersRouter.post('/create', JWTMiddleware, async (request, response, next) => {
  let total = 0
  try {
    const newOrder = new ordersModel(request.body)
    newOrder.customerID = request.user.id

    newOrder.orderedItems.map(
      (menuItem) => (total += menuItem.price * menuItem.quantity),
    ),
      console.log(total)
    newOrder.totalPrice = total
    const { _id } = await newOrder.save()

    response.status(200).send({ _id })
  } catch (error) {
    console.log(error)
    next()
  }
})

ordersRouter.put(
  '/updateOrder/:id',
  JWTMiddleware,
  async (request, response, next) => {
    try {
      const updateOrder = await ordersModel.findByIdAndUpdate(
        request.params.id,
        request.body,
        { new: true },
      )

      response.status(200).send({ message: 'Order Updated' })
    } catch (error) {
      console.log(error)
      next()
    }
  },
)

//Retrieve the current order

ordersRouter.get(
  '/currentOrder',
  JWTMiddleware,
  async (request, response, next) => {
    try {
      const currentOrder = await ordersModel.find({
        customerID: request.user.id,
      })

      if (currentOrder) {
        response.status(200).send(currentOrder)
      } else {
        response
          .status(404)
          .send({ message: 'There was no current order found' })
      }
    } catch (error) {
      console.log(error)
      next()
    }
  },
)

//Retrieve an order by ID
ordersRouter.get('/:id', JWTMiddleware, async (request, response, next) => {
  try {
    const order = await ordersModel
      .findById(request.params.id)
      .populate('customerID')
    response.status(200).send(order)
  } catch (error) {
    next()
  }
})

//Get all the pending orders
ordersRouter.get(
  '/:restaurantID/pending',
  JWTMiddleware,
  OwnerMiddleware,
  async (request, response, next) => {
    try {
      const orders = await ordersModel
        .find({
          restaurantID: request.params.restaurantID,
          orderStatus: { $nin: ['Delivered', 'Awaiting Payment'] },
        })
        .populate('customerID')

      response.status(200).send(orders)
    } catch (error) {
      next()
    }
  },
)

ordersRouter.get(
  '/:restaurantID/delivered',
  JWTMiddleware,
  OwnerMiddleware,
  async (request, response, next) => {
    try {
      const orders = await ordersModel
        .find({
          restaurantID: request.params.restaurantID,
          orderStatus: 'Delivered',
        })
        .populate('customerID')

      response.status(200).send(orders)
    } catch (error) {
      next()
    }
  },
)

ordersRouter.get(
  '/:orderID/secret',
  JWTMiddleware,
  async (request, response) => {
    const order = await ordersModel.findById(request.params.orderID)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true },
    })

    const intent = response.json({ client_secret: paymentIntent.client_secret }) // ... Fetch or create the PaymentIntent
  },
)

//Get all the orders of a specific customer
ordersRouter.get(
  '/myOrders',
  JWTMiddleware,
  async (request, response, next) => {
    const limit = request.query.limit
    try {
      const order = await ordersModel
        .find({ customerID: request.user.id })
        .populate('customerID')
        .populate('restaurantID')
        .limit(limit)

      order.reverse()

      response.status(200).send(order)
    } catch (error) {
      next()
    }
  },
)

export default ordersRouter
