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

    static async generageShareId() {
        try {
            const [result] = await db.query('SELECT u_share_id AS ShareId FROM users ORDER BY id DESC LIMIT 1')
            const currentMaxId = result[0].ShareId || "0"
            const idNumber = parseInt(currentMaxId) + 1
            return idNumber
        } catch (error) {
            throw error
        }
    }


    static async create(userData) {
        try {
            const NextId = await this.generageMaxId()
            const ShareId = await this.generageShareId()

            userData.u_number = NextId
            userData.u_share_id = ShareId

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
            SELECT *,CONCAT(a.u_title,a.u_firstname,' ',a.u_lastname)as username,a.u_address,
            CONCAT(a.u_address ,' ต.',d.name_in_thai,' อ.',c.name_in_thai,' จ.',b.name_in_thai, ' ', d.zip_code) AS u_addressfull 
            FROM kanyangDB.Users a
            inner join kanyangDB.provinces b
            on a.provinces_id = b.id 
            inner join kanyangDB.districts c
            on c.id = a.districts_id
            inner join kanyangDB.subdistricts d 
            on d.id = a.subdistricts_id order by a.id asc`)
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