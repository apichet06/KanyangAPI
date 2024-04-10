const sharepercentController = require('../controllers/sharepercentController')
const express = require('express')

const routes = express.Router()


routes.post('/', sharepercentController.CreateSharepercent)
routes.put('/:id', sharepercentController.UpdateSharepercent)
routes.delete('/', sharepercentController.DeleteSharepercent)
routes.get('/', sharepercentController.GetSharepercent)
routes.get('/share/', sharepercentController.GetShareAll)
module.exports = routes