const express = require('express')
const ProvincesController = require('../controllers/provincesController')


const routes = express.Router()

routes.get('/', ProvincesController.GetProvinces)

module.exports = routes;
