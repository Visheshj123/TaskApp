const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require("../models/user")
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, cancelEmail } = require('../emails/account')

var upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, callback) {
    file.originalname.match(/\.(jpg|png|jpeg)$/) ? callback(null,true) :  callback(new Error('file must be a of type jpg, png, or jpeg'))
  }
})

//Resource creation
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = user.generateAuthToken()

    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({
      user,
      token
    })
  } catch (e) {
    res.status(400).send(e.message)
  }
})

//Loggout, this means to destory the currently used token
router.post('/users/logout', auth, async (req, res) => {
  try {
    //we dont have to use model methods because req.user is our document of interest
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()
    res.status(200).send()
  } catch (e) {
    res.status(500).send('Unable to logout')
  }
})

//destroy all tokens upon loggout (restrict all devices from logging in)
router.post('/users/logoutAll', auth, async (req, res) => {
  //return empty tokens array
  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).send('Destroyed all tokens')
  } catch (e) {
    res.status(500).send('Unable to destroy tokens')
  }
})

//Get your own profile, get user profile from auth.js
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)

})

router.patch('/users/me', auth, async (req, res) => {
  const validFields = ["name", "email", "age", "password"]
  const updates = Object.keys(req.body)
  const isValid = updates.every(field => {
    if (!validFields.includes(field)) {
      return false
    } else {
      return true
    }
  })
  if (!isValid) return res.status(400).send('Invalid Body')
  try {
    const user = req.user
    updates.forEach(update => {
      user[update] = req.body[update]
    })
    await user.save()

    res.send(`Updated Document`)
  } catch (e) {
    res.status(400).send(e.message)
  }

})


router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    cancelEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e.message)
  }
})


//
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  //req.user.avatar = req.file.buffer
  const buffer = await sharp(req.file.buffer)
    .png()
    .resize(250, 250)
    .toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send('successfuly upload file')
}, (err, req, res, next) => {
  res.status(400).send({
    err: err.message
  })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  //by setting it to undefined we are deleting it, will not raise error if there is no avatar field
  req.user.avatar = undefined;
  await req.user.save()
  res.status(200).send('Delelted Avatar')
})

//Fetching an avatar picture
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error('No avatar found for that user ID')
    } else {
      res.set('Content-type', 'image/png')
      res.send(user.avatar)
    }

  } catch (e) {
    res.status(404).send(e.message)
  }
})


module.exports = router
