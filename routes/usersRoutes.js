const express = require('express')
const usersController = require('../controllers/usersController')

const routes = express.Router()


routes.get('/', usersController.GetUsersAll)
routes.get('/:u_number', usersController.GetUsersById)
routes.post('/', usersController.CreateUsers)
routes.put('/:u_number', usersController.UpdateUsers)
routes.delete('/:u_number', usersController.DeleteUsers)

module.exports = routes
