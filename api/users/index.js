import express from 'express'
import createHttpError from 'http-errors'
import usersModel from './model.js'

const usersRouter = express.Router()

//Create a new user account

usersRouter.post('/register', async (request, response, next) => {
  try {
    const newUser = new usersModel(request.body)
    const { _id, role } = await newUser.save()

    response.status(200).send(newUser)
  } catch (error) {
    next(error)
  }
})

export default usersRouter
