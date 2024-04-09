const express = require('express')
const districtsController = require('../controllers/districtsController')

const routes = express.Router()


routes.get('/:province_id', districtsController.GetDistricts)


module.exports = routes