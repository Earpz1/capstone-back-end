import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import usersRouter from '../api/users/index.js'

const server = express()
const port = 3001

//Middleware
server.use(cors())
server.use(express.json())

//Endpoints
server.use('/users', usersRouter)

//Error Handlers

mongoose.connect(process.env.MONGO_DB_URL)

mongoose.connection.on('connected', () => {
  server.listen(port, () => {
    console.log(`Database and server connected on port ${port}`)
  })
})
