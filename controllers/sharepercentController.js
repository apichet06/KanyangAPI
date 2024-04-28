const sharepercentModel = require('../models/sharepercentModel')
const Messages = require('../config/messages')


class SharepercentController {
    static async CreateSharepercent(req, res) {
        try {
            const { s_year, s_percent, s_huatun } = req.body
            const sharepercentData = { s_year, s_percent, s_huatun }


            const [year] = await sharepercentModel.GetByYear(s_year)

            if (year)
                return res.status(400).json({ status: Messages.error, message: Messages.exists + s_year })

            const Data = await sharepercentModel.create(sharepercentData)

            if (Data)
                res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }


    }
    static async UpdateSharepercent(req, res) {
        try {
            const { id } = req.params
            const { s_year, s_percent, s_huatun } = req.body
            const sharepercentData = { s_year, s_percent, s_huatun }
            const Data = await sharepercentModel.update(sharepercentData, id)

            if (!Data)
                res.status(400).json({ status: Messages.error, message: Messages.updateFailed })
            else
                res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async DeleteSharepercent(req, res) {
        try {
            const { id } = req.params
            const Data = await sharepercentModel.delete(id)

            if (!Data)
                res.status(400).json({ status: Messages.error, message: Messages.deleteFailed })
            else
                res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async GetSharepercent(req, res) {
        try {
            const { id } = req.params
            const Data = await sharepercentModel.GetAll(id)
            if (Data)
                res.status(200).json({ status: Messages.ok, data: Data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async GetShareAll(req, res) {
        try {
            const data = await sharepercentModel.getShareAll()
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
}

module.exports = SharepercentController