require('./db/mongoose')
const User = require('./models/user')

//5e78eff89cc881114227d4e6
/*User.findByIdAndUpdate('5e78eff89cc881114227d4e6', {age: 2})
  .then(data => {
    console.log(data.email.toString())
    return User.countDocuments({email: 'yourmom@aim.com'})
  })
  .then((count) => {
    console.log(count)
  })
  .catch(err => console.log(err))*/



const updateAgeAndCount = async (id, age) => {
    const updatedUser = await User.findByIdAndUpdate(id, {age: age})
    const numDocuments = await User.countDocuments({age: age})
    return numDocuments
  }

  updateAgeAndCount('5e78eff89cc881114227d4e6', 12)
    .then(Count => {
      console.log(`The number of people of age 12 is ${Count}`)
    })
    .catch(err => console.log(err))
