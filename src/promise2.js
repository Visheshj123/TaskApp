require('./db/mongoose')
const Task = require('./models/task')
/*Task.findByIdAndDelete('5e7a13e7ceb9b12ae2faf00d')
  .then(data => {
    return Task.countDocuments({completed: false})
  })
  .then(count => {
    console.log(`the number of incomplete tasks is ${count}`)
  })*/

const deleteTask = async(id) => {
  const deleted = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({completed: false})
  return count
}

deleteTask('5e78f20b75e71a11579a4ae6')
  .then(count =>{
    console.log(`the number of incomplete tasks is ${count}`)
  })
  .catch(err => console.log(err))
