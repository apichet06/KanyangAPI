const weightController = require('../controllers/weightController')
const express = require('express')
const routes = express.Router()


routes.post('/weight', weightController.GetWeightpriceAll);
routes.post('/Export', weightController.ExportExcelWeightprice);
routes.get('/users/:u_number', weightController.GetWeightUserById);
routes.get('/:w_number', weightController.GetWeightpriceById);
routes.post('/', weightController.CreateWeightprice);
routes.put('/:w_number', weightController.UpdateWeightprice);
routes.delete('/:w_number', weightController.DeleteWeightprice);


module.exports = routes