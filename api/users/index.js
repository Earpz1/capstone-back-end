import express from 'express'
import createHttpError from 'http-errors'
import { createAccessToken, JWTMiddleware } from '../../lib/tools.js'
import usersModel from './model.js'

const usersRouter = express.Router()

//Create a new user account and return an accessToken

usersRouter.post('/register', async (request, response, next) => {
  try {
    const newUser = new usersModel(request.body)
    const { _id, role } = await newUser.save()

    const payload = { id: _id, role: role }
    const accessToken = await createAccessToken(payload)

    response.status(200).send({ accessToken: accessToken })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//Allow a user to login and return an accessToken

usersRouter.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body
    const user = await usersModel.checkDetails(email, password)

    if (user) {
      const payload = { id: user._id, role: user.role }
      const accessToken = await createAccessToken(payload)
      response.send({ accessToken: accessToken })
    } else {
      next(
        createHttpError(
          401,
          'Your login details are not correct. Please check them and try again',
        ),
      )
    }
  } catch (error) {
    console.log(error)
    next()
  }
})

//Allow a user to get their own details - NOT INCLUDING PASSWORD
usersRouter.get('/me', JWTMiddleware, async (request, response, next) => {
  try {
    const user = await usersModel
      .findById(request.user.id)
      .select({ password: 0 })

    if (user) {
      response.send(user)
    } else {
      next(
        createHttpError(404, `Unable to find user with ID ${request.user._id}`),
      )
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//Convert the users account into an owner account & send a new accessToken
usersRouter.put(
  '/editDetails',
  JWTMiddleware,
  async (request, response, next) => {
    try {
      const user = await usersModel.findByIdAndUpdate(
        request.user.id,
        request.body,
        { new: true },
      )
      const payload = { id: user._id, role: user.role }
      const accessToken = await createAccessToken(payload)

      response.status(200).send({ accessToken: accessToken })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
)
export default usersRouter
