const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//Endusers shouldn't have to speicfy the owner of the new task, should be automatically appended based on who is logged in
router.post('/tasks', auth, async (req,res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try{
    await task.save()
    res.status(201).send('successfully added task')
  }catch(e){
    res.status(400).send(e.message)
  }

})

//Get list of all tasks that match the query
//sortBy=createdAt_asc or createdAt_desc
router.get('/tasks', auth, async(req,res) => {

  const sort = {}

  if(req.query.sortBy){
    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  match = {}
  req.query.completed ? match.completed = req.query.completed.toString() : match.completed = 'false'
  try{
    await req.user.populate({
      path: 'tasks',
      match,
      options : {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    res.status(200).send(req.user.tasks)
  }catch(e){
     res.status(400).send('Invalid search');
  }
})

//Get Task by ID
router.get('/tasks/:id', auth, async (req,res) => {
  const _id = req.params.id
  try{
    const result = await Task.findOne({_id, owner: req.user._id})
    if(!result) res.status(404).send('No results matched that id');
    res.send(result);
  }catch(e){
      res.status(500).send(e.message)
  }
})

router.patch("/tasks/:id", auth, async (req,res) => {
  //Check if fields are allowablem must be "completed, description"
  const validFields = ["completed", "description"]
  const isAllowed = Object.keys(req.body).every(field => {
    return (!validFields.includes(field) ? false : true)
  })
  console.log(isAllowed)
  if(!isAllowed){
    return res.status(400).send('Enter valid Fields')
  }

  try{
    //fetch task to update
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task) return res.status(404).send('No results matched that id');
    Object.keys(req.body).forEach(field => {
      task[field] = req.body[field]
    });
    await task.save();

    res.send(`Updated task`)
  }catch(e){
    res.send(e.message)
  }
})

router.delete('/tasks/:id', auth, async (req,res) => {
  try{
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!deleted) return res.status(404).send('No matches with that id')
    res.send(deleted)
  }catch(e){
    res.status(500).send(e.message)
  }
})

module.exports = router
