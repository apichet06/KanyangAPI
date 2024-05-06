const usersModel = require('../models/usersModel')
const Messages = require('../config/messages')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class Users {
    static async CreateUsers(req, res) {
        try {
            const { u_title, u_firstname, u_lastname, u_address, provinces_id, districts_id, subdistricts_id, u_share, u_status, u_admin } = req.body
            const hashedPassword = await bcrypt.hash('123456', 10);

            const usersData = { u_title, u_firstname, u_lastname, u_password: hashedPassword, u_address, provinces_id, districts_id, subdistricts_id, u_share, u_status, u_admin }

            const UserDuplicate = await usersModel.getDuplicateUsers(u_firstname, u_lastname)

            if (UserDuplicate) {
                res.status(400).json({ status: Messages.error, message: Messages.exists + u_firstname + ' ' + u_lastname })
            } else {
                const users = await usersModel.create(usersData)
                delete users[0].u_password
                if (users)
                    res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: users })
                else
                    res.status(400).json({ status: Messages.error, message: Messages.updateFailed })
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }

    }

    static async UpdateUsers(req, res) {
        try {
            const { u_number } = req.params
            const { u_title, u_firstname, u_lastname, u_address, provinces_id, districts_id, subdistricts_id, u_share, u_status, u_admin } = req.body
            const usersData = { u_title, u_firstname, u_lastname, u_address, provinces_id, districts_id, subdistricts_id, u_share, u_status, u_admin }

            const users = await usersModel.update(usersData, u_number)
            delete users[0].u_password
            if (users)
                res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data: users })
            else
                res.status(400).json({ status: Messages.error, message: Messages.updateFailed })


        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }


    static async changPaassword(req, res) {
        try {
            const { u_number } = req.params
            const { u_password, u_passwordold, } = req.body
            const hashedPassword = await bcrypt.hash(u_password, 10);
            const usersData = { u_password: hashedPassword }
            const [checkUsers] = await usersModel.getById(u_number)
            const passwordMatch = await bcrypt.compare(u_passwordold, checkUsers.u_password)

            if (!passwordMatch) {
                return res.status(400).json({ error: Messages.PasswordNotmatch });
            } else {
                const users = await usersModel.updatePassword(usersData, u_number)
                delete users[0].u_password
                if (users)
                    res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: users })
                else
                    res.status(400).json({ status: Messages.error, message: Messages.updateFailed })
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }

    }



    static async DeleteUsers(req, res) {
        try {
            const { u_number } = req.params
            if (u_number === 'U10000001') {
                res.status(400).json({ status: Messages.error, message: Messages.UndeleteUser })
            } else {
                const data = await usersModel.delete(u_number)
                if (data)
                    res.status(200).json({ status: Messages.ok, data: data, message: Messages.deleteSuccess })
                else
                    res.status(400).json({ status: Messages.deleteFailed, message: error.message })
            }

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async GetUsersAll(req, res) {
        try {
            const data = await usersModel.getAll()
            const datanonpass = data.map(({ u_password, ...rest }) => rest)
            if (data)

                res.status(200).json({ status: Messages.ok, data: datanonpass })
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

    static async Login(req, res) {

        try {
            const { u_number, u_password } = req.body

            const [user] = await usersModel.getById(u_number.toUpperCase());

            if (!user) {
                return res.status(400).json({ error: Messages.userNotFound });
            }

            const passwordMatch = await bcrypt.compare(u_password, user.u_password)
            if (!passwordMatch) {
                return res.status(401).json({ error: Messages.invalidPassword });
            }
            const token = jwt.sign({ userId: user.u_number, username: user.u_title + user.u_firstname + ' ' + user.u_lastname, status: user.u_status }, process.env.JWT_SECRET, { expiresIn: '24h' });
            delete user.u_password
            // Return the token
            res.json({ status: Messages.ok, token, user });
        } catch (error) {
            res.status(500).json({ error: Messages.error500, message: error.message });
        }
    }
}
module.exports = Users