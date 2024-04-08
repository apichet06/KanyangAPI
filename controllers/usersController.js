const usersModel = require('../models/usersModel')
const Messages = require('../config/messages')

class Users {
    static async CreateUsers(req, res) {
        try {
            const { u_title, u_firstname, u_lastname, u_address, provinces_id, districts_id, subdistricts_code } = req.body
            const usersData = { u_title, u_firstname, u_lastname, u_address, provinces_id, districts_id, subdistricts_code }

            const users = await usersModel.create(usersData)
            if (users)
                res.status(200).json({ status: Messages.ok, messages: Messages.insertSuccess, data: users })
            else
                res.status(400).json({ status: Messages.error, message: Messages.updateFailed })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }

    }

    static async UpdateUsers(req, res) {
        try {
            const { u_number } = req.params
            const { u_title, u_firstname, u_lastname, u_address, provinces_id, districts_id, subdistricts_code } = req.body
            const usersData = { u_title, u_firstname, u_lastname, u_address, provinces_id, districts_id, subdistricts_code }

            const users = await usersModel.create(usersData, u_number)
            if (users)
                res.status(200).json({ status: Messages.ok, messages: Messages.updateSuccess, data: users })
            else
                res.status(400).json({ status: Messages.error, message: Messages.updateFailed })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async DeleteUsers(req, res) {
        try {
            const { u_number } = req.params
            const data = await usersModel.delete(u_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
            else
                res.status(400).json({ status: Messages.deleteFailed, message: error.message })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async GetUsersAll(req, res) {
        try {
            const data = await usersModel.getAll()
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async GetUsersById(req, res) {
        try {
            const { u_number } = req.params
            const data = await usersModel.getById(u_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
}
module.exports = Users