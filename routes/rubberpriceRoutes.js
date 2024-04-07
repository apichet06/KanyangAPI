const rubberController = require('../controllers/rubberpriceController')

const express = require('express')
const routes = express.Router()



routes.post('/', rubberController.CreateRubberPrice)
routes.put('/:r_number', rubberController.updateRubberPrice)
routes.delete('/:r_number', rubberController.DeleteRubberPrice)
routes.get('/', rubberController.ShowRubberPriceAll)

module.exports = routes 