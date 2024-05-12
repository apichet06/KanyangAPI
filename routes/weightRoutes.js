const weightController = require('../controllers/weightController')
const express = require('express')
const routes = express.Router()


routes.post('/weight', weightController.GetWeightpriceAll)
routes.get('/:w_number', weightController.GetWeightpriceById)
routes.get('/users/:u_number', weightController.GetWeightUserById)
routes.post('/', weightController.CreateWeightprice)
routes.put('/:w_number', weightController.UpdateWeightprice)
routes.delete('/:w_number', weightController.DeleteWeightprice)

module.exports = routes