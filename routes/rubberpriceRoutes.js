const rubberController = require('../controllers/rubberpriceController')
const express = require('express')
const auth = require('../middleware/auth')
const routes = express.Router()



routes.post('/', auth.authenticateToken, rubberController.CreateRubberPrice)
routes.put('/:r_number', auth.authenticateToken, rubberController.updateRubberPrice)
routes.delete('/:r_number', auth.authenticateToken, rubberController.DeleteRubberPrice)
routes.get('/', rubberController.ShowRubberPriceAll)
routes.get('/:r_number', rubberController.ShowRubberPriceById)
module.exports = routes 