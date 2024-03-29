import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const { Schema, model } = mongoose

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  role: { type: String, required: true, default: 'customer' },
  restaurantID: { type: Schema.Types.ObjectId, ref: 'restaurantModel' },
})

userSchema.pre('save', async function (next) {
  const currentUser = this

  if (currentUser.isModified('password')) {
    const plainPassword = currentUser.password
    const hashedPassword = await bcryptjs.hash(plainPassword, 10)
    currentUser.password = hashedPassword
  }
  next()
})

userSchema.static('checkDetails', async function (email, password) {
  const user = await this.findOne({ email })

  if (user) {
    const passwordMatch = await bcryptjs.compare(password, user.password)

    if (passwordMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

export default model('usersModel', userSchema)
