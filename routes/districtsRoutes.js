const express = require('express')
const districtsController = require('../controllers/districtsController')

const router = express.Router()


router.get('/:province_id', districtsController.GetDistricts)


module.exports = router