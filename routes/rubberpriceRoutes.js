const rubberController = require('../controllers/rubberpriceController')
const express = require('express')
const auth = require('../middleware/auth')
const routes = express.Router()



routes.post('/', rubberController.CreateRubberPrice)
routes.put('/:r_number', rubberController.updateRubberPrice)
routes.delete('/:r_number', rubberController.DeleteRubberPrice)
routes.get('/', rubberController.ShowRubberPriceAll)
routes.get('/:r_number', rubberController.ShowRubberPriceById)
routes.get('/data/chart/', rubberController.RubberPriceChart)

module.exports = routes 