const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {useUnifiedTopology: true, useNewUrlParser: true})



/*const Task = mongoose.model('Task', {
  description: {
    type: String,
    trim: true,
    required: [true, 'must gimme a description']
  },
  completed: {
    type: Boolean,
    default: false
    }
})
//Create instnace of new user
//const me = new User({name: 'Pebbles', email: 'yourMom@aim.com', password: 'password1'})
//const task = new Task({description: '   Slept   '})

//Save document to Database
/*me.save().then((me) => {
  console.log(me)
}).catch(e => console.log(e))*/

//task.save().then(me => console.log(me)).catch(e => console.log(e))
