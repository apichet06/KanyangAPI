const db = require('../config/db')

class sharepercentModel {
    static async create(sharepercentData) {
        try {
            const [result] = await db.query("INSERT INTO share_percent SET ?", [sharepercentData])
            return result || null
        } catch (error) {
            throw error
        }
    }
    static async update(sharepercentData, id) {
        try {
            const [result] = await db.query("UPDATE share_percent SET ? Where id = ?", [sharepercentData, id])
            return result || null
        } catch (error) {
            throw error
        }
    }
    static async delete(id) {
        try {
            const [result] = await db.query("DELETE FROM share_percent WHERE id = ?", [id])
            return result.affectedRows
        } catch (error) {
            throw error
        }
    }
    static async GetAll() {
        try {
            const [result] = await db.query("SELECT * FROM share_percent ORDER BY id DESC ")
            return result || null
        } catch (error) {
            throw error
        }
    }

}

module.exports = sharepercentModel