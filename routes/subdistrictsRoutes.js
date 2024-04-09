const express = require('express')
const subdistrictController = require('../controllers/subdistrictsController')


const routes = express.Router()

routes.get('/:district_id', subdistrictController.GetSubdistricts)

module.exports = routes