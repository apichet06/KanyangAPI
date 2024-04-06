const express = require('express')
const subdistrictController = require('../controllers/subdistrictsController')


const router = express.Router()

router.get('/:district_id', subdistrictController.GetSubdistricts)

module.exports = router