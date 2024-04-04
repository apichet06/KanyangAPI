const express = require('express')
const ProvincesController = require('../controllers/provincesController')


const router = express.Router()

router.get('/', ProvincesController.GetProvinces)

module.exports = router;
