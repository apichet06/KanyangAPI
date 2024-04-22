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
    static async getShareAll() {
        try {
            const [result] = await db.query(
                `SELECT  year(b.w_datetime) as year_w_datetime,a.u_number,
                    Max(a.u_title) as u_title,
                    Max(a.u_firstname) as u_firstname,
                    Max(a.u_lastname) as u_lastname,
                    MAX(CONCAT(a.u_address ,' ต.',e.name_in_thai,' อ.',d.name_in_thai,' จ.',c.name_in_thai, ' ', e.zip_code)) AS u_address,
                    Max(a.u_share) as u_share,
                    Max(( SELECT s_percent FROM kanyangDB.share_percent WHERE s_year = 2024)) AS percent,
                    ROUND(Max(((SELECT s_percent FROM kanyangDB.share_percent WHERE s_year = 2024) * a.u_share)/100),2) AS shareCount,
                    COALESCE(SUM(b.w_weigth),0) AS weightSum,
                    Max(( SELECT s_money FROM kanyangDB.share_percent WHERE s_year = 2024)) AS percent_yang,
                    ROUND(COALESCE(SUM((SELECT SUM(s_money/1000) FROM kanyangDB.share_percent WHERE s_year = 2024) * b.w_weigth), 0),2) AS weightPriceSum,
                    ROUND(COALESCE(Max(((SELECT s_percent FROM kanyangDB.share_percent WHERE s_year = 2024) * a.u_share)/100),0) +
                    COALESCE(SUM((SELECT SUM(s_money/1000) FROM kanyangDB.share_percent WHERE s_year = 2024) * b.w_weigth), 0),2)
                AS sumPrice
                FROM kanyangDB.Users a 
                LEFT JOIN kanyangDB.weight_price b
                ON a.u_number = b.u_number
                INNER JOIN kanyangDB.provinces c
                ON c.id = a.provinces_id
                INNER JOIN kanyangDB.districts d
                ON d.id = a.districts_id
                INNER JOIN kanyangDB.subdistricts e
                ON e.id = a.subdistricts_id
                GROUP BY a.u_number,year(b.w_datetime)
                ORDER BY a.u_number,year(b.w_datetime) desc`
            )
            if (result)
                return result
            else
                throw new Error(Messages.notFound)
        } catch (error) {
            throw error
        }
    }
}

module.exports = sharepercentModel