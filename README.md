# TaskApp
NodeJS application to create users, login, logout as well as to create, view, and delete tasks

## API Requests


### Users
- POST https://damp-oasis-68705.herokuapp.com/users, which requires name, email, password in JSON object
- POST https://damp-oasis-68705.herokuapp.com/users/login, which takes in email and password
- POST https://damp-oasis-68705.herokuapp.com/users/logout
- PATCH https://damp-oasis-68705.herokuapp.com/users/me, can update any field 
- POST https://damp-oasis-68705.herokuapp.com/users/me/avatar, takes in form-data and jpg, jpeg, png image
- DELETE avatar https://damp-oasis-68705.herokuapp.com/users/me/avatar
- GET avatar https://damp-oasis-68705.herokuapp.com/users/:id/avatar, fetches Avatar image

### Tasks
- POST https://damp-oasis-68705.herokuapp.com/tasks, takes in { completed: bool, description: string }
- GET Tasks  https://damp-oasis-68705.herokuapp.com/tasks, accepts query strings ?createdAt_(asc | desc), ?completed=( true | false), ?limit, ?skip
- GET Tasks by ID https://damp-oasis-68705.herokuapp.com/tasks/:id
- PATCH https://damp-oasis-68705.herokuapp.com/tasks/:id
- DELETE Task https://damp-oasis-68705.herokuapp.com/tasks/:id
