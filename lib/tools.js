import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import usersModel from '../users/model.js'
import atob from 'atob'

export const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1 week' },
      (error, token) => {
        if (error) reject(error)
        else resolve(token)
      },
    ),
  )
