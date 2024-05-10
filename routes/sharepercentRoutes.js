const sharepercentController = require('../controllers/sharepercentController')
const express = require('express')

const routes = express.Router()


routes.post('/', sharepercentController.CreateSharepercent)
routes.put('/:id', sharepercentController.UpdateSharepercent)
routes.delete('/:id', sharepercentController.DeleteSharepercent)
routes.get('/', sharepercentController.GetSharepercent)
routes.post('/share/', sharepercentController.SearchShare)
module.exports = routes