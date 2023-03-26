import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import usersRouter from '../api/users/index.js'
import restaurantRouter from '../api/restaurants/index.js'
import { unauthorizedError } from './errorHandler.js'
import menuItemsRouter from '../api/menuItems/index.js'
import ordersRouter from '../api/orders/index.js'

const server = express()
const port = 3001

//Middleware
server.use(cors())
server.use(express.json())

//Endpoints
server.use('/users', usersRouter)
server.use('/restaurant', restaurantRouter)
server.use('/menuItem', menuItemsRouter)
server.use('/orders', ordersRouter)

//Error Handlers
server.use(unauthorizedError)

mongoose.connect(process.env.MONGO_DB_URL)

mongoose.connection.on('connected', () => {
  server.listen(port, () => {
    console.log(`Database and server connected on port ${port}`)
  })
})
