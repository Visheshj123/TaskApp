const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      validate: function (value){
        if (!validator.isEmail(value)) {
          throw new Error('Must enter a valid email')
        }
      },
      required: [true, 'Please enter an email address']
    },
    age:{
      type: Number,
      default: 12
    },
    password: {
      type: String,
      required:true,
      minLength: 6,
      trim: true,
      validate: function (value){
        if (value === 'password'){
          throw new Error('Try another Password')
        }
      }
    },
    tokens : [{
      token: {
        type: String,
        required: true,
      }
    }],
    avatar: {
      type: Buffer
    }
}, {timestamps: true })

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.pre('save', async function(next){ //save is a model function, so this points to the object that owns save. which by the we call new User, is out new User object
  const user = this //because this function executes before save, which belongs to the User object, this refers to the User Object

  //check if password has been modified via creating or patching a user's password
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }

  next();
})

//Delete Tasks when user is deleted
userSchema.pre('remove', async function(next){
  const user = this;
  //user owner field to delete all tasks
  await Task.deleteMany({ owner: user._id })

  next()
})


userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, process.env.SECRET_KEY)
  user.tokens = user.tokens.concat({ token })
  await user.save();
  return token;

}

userSchema.statics.findByCredentials = async function(email, password){
  //access database using findby(), which is accessible by the model, which we will have access to when we call this function
  const user = await this.findOne({ email })
  if(!user) throw new Error('Unable to login')
  const isMatch = await bcrypt.compare(password, user.password) //except user.password should be the hash and password is in plain text?
  if(!isMatch) throw new Error('Unable to login')
  return user
}

userSchema.methods.toJSON = function(){
  const user = this;
  //converts to JS object that can more easily be manipualted without changing the data stored in the DB
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}


const User = mongoose.model('User', userSchema) //Converting a schema into a model object named User

module.exports = User;
