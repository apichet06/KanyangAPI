const express = require('express')
const usersController = require('../controllers/usersController')
const auth = require('../middleware/auth')

const routes = express.Router()


routes.get('/', usersController.GetUsersAll)
routes.get('/:u_number', auth.authenticateToken, usersController.GetUsersById)
routes.post('/', auth.authenticateToken, usersController.CreateUsers)
routes.put('/:u_number', auth.authenticateToken, usersController.UpdateUsers)
routes.delete('/:u_number', auth.authenticateToken, usersController.DeleteUsers)
routes.post('/login', usersController.Login);
routes.put('/changepassword/:u_number', usersController.changPaassword)
module.exports = routes 