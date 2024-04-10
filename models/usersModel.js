const db = require('../config/db');


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

            const [sql] = await db.query('UPDATE users SET ? WHERE u_number=?', [userData, u_number])
            const [result] = await db.query('SELECT * FROM users WHERE u_number = ?', u_number)
            if (sql)
                return result || null
        } catch (error) {
            throw error
        }

    }
    static async updatePassword(userData, u_number) {
        try {
            const [sql] = await db.query('UPDATE users SET ? WHERE u_number=?', [userData, u_number])
            const [result] = await db.query('SELECT * FROM users WHERE u_number = ?', u_number)
            if (sql)
                return result || null
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
            const [result] = await db.query(`
            SELECT * FROM Users a
            inner join provinces b
            on a.provinces_id = b.id 
            inner join districts c
            on c.id = a.districts_id
            inner join subdistricts d 
            on d.id = a.subdistricts_id`)
            return result
        } catch (error) {
            throw error
        }

    }
    static async getById(u_number) {
        try {
            const [result] = await db.query(`
            SELECT * FROM Users a
            inner join provinces b
            on a.provinces_id = b.id 
            inner join districts c
            on c.id = a.districts_id
            inner join subdistricts d 
            on d.id = a.subdistricts_id  Where u_number = ? `, [u_number])
            if (result)
                return result || null
        } catch (error) {
            throw error
        }

    }
    static async getDuplicateUsers(u_firstname, u_lastname) {
        try {
            const [result] = await db.query("SELECT * FROM users Where u_firstname =? and u_lastname = ? ", [u_firstname, u_lastname])
            return result.length > 0
        } catch (error) {
            throw error
        }
    }

}

module.exports = Users;