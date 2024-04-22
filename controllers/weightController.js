const Messages = require('../config/messages')
const WeightModel = require('../models/weightModel')


class WeightController {

    static async CreateWeightprice(req, res) {
        try {
            const { w_weigth, u_number, r_number, w_admin } = req.body
            const weigthData = { w_weigth, u_number, r_number, w_admin }

            const data = await WeightModel.create(weigthData)

            if (data)
                res.status(200).json({ status: Messages.ok, data: data })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }

    }
    static async UpdateWeightprice(req, res) {
        try {
            const { w_number } = req.params

            const { w_weigth, r_number, w_price, u_number, w_admin } = req.body
            const weigthData = { w_weigth, r_number, w_price, u_number, w_admin }
            const data = await WeightModel.update(weigthData, w_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async DeleteWeightprice(req, res) {
        try {
            const { w_number } = req.params

            const data = await WeightModel.delete(w_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
            else
                res.status(400).json({ status: Messages.deleteFailed, message: error.message })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async GetWeightpriceAll(req, res) {
        try {

            const data = await WeightModel.getAll()
            const sanitizedData = data.map(({ u_password, ...rest }) => rest);
            if (data)
                res.status(200).json({ status: Messages.ok, data: sanitizedData })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async GetWeightpriceById(req, res) {
        try {
            const { w_number } = req.params
            const data = await WeightModel.getById(w_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async GetWeightUserById(req, res) {
        try {
            const { u_number } = req.params

            const data = await WeightModel.getUserById(u_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

}

module.exports = WeightController

