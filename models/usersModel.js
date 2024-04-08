const db = require('../config/db');
const Messages = require('../config/messages');

class Users {
    static async generageMaxId() {
        try {
            const [result] = await db.query('SELECT MAX(u_number) as MaxId FROM users')
            const currentMaxId = result[0].MaxId || "U10000000"
            const idNumber = parseInt(currentMaxId.slice(1)) + 1
            return "U" + idNumber.toString().padStart(7, '0')
        } catch (error) {
            throw error
        }

    }
    static async create(userData) {
        try {
            const NextId = await this.generageMaxId()
            userData.u_number = NextId
            userData.u_password = 123456
            const [sql] = await db.query('INSERT INTO users SET ?', [userData])
            const [result] = await db.query('SELECT * FROM users WHERE id = ?', sql.insertId)
            if (result)
                return result

        } catch (error) {
            throw error
        }

    }
    static async update(userData, u_number) {
        try {
            const NextId = await this.generageMaxId()
            userData.u_number = NextId

            const [sql] = await db.query('INSERT INTO users SET ?', [userData])
            const [result] = await db.query('SELECT * FROM users WHERE u_number = ?', u_number)
            if (sql)
                return result
        } catch (error) {
            throw error
        }

    }
    static async delete(u_number) {
        try {
            const [result] = await db.query('DELETE FROM users WHERE u_number = ?', u_number)
            return result.affectedRows

        } catch (error) {
            throw error
        }

    }
    static async getAll() {
        try {
            const [result] = await db.query("SELECT * FROM users")
            return result
        } catch (error) {
            throw error
        }

    }
    static async getById(u_number) {
        try {
            const [result] = await db.query("SELECT * FROM users Where u_number = ? ", u_number)
            return result
        } catch (error) {
            throw error
        }

    }
}

module.exports = Users;