import mongoose from 'mongoose'

export const unauthorizedError = (error, request, response, next) => {
  if (error.status === 401) {
    response.status(401).send(error.message)
  } else {
    next()
  }
}
