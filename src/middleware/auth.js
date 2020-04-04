const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req,res,next) => {
  try{
    console.log('hello')
    const token = req.header('authorization').replace('Bearer ','');
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    console.log(decoded);
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
    if(!user) throw new Error()
    req.user = user //appending to req object so event handler can quickly use this
    req.token = token
    next()
  }catch(e){
    res.status(401).send({err: 'Please authenticate'})

  }

}

module.exports = auth
