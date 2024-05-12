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

    static async GetByYear(year) {

        try {
            const [result] = await db.query("SELECT * FROM share_percent  Where s_year = ? ", [year])
            return result || null
        } catch (error) {
            throw error
        }
    }


    static async isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }


    static async PostShare(Data) {
        try {

            const isLeap = await this.isLeapYear(Data.year);
            const lastDay = isLeap ? 29 : 28;



            const currentDate = new Date().getFullYear();
            const yearStart = Data.year === '' ? `${currentDate}-02-${lastDay}` : `${Data.year}-02-${lastDay}`;
            const yearEnd = Data.year === '' ? `${currentDate + 1}-03-01` : `${parseInt(Data.year) + 1}-03-01`;


            const [result] = await db.query(
                `SELECT  
                MAX(CASE
                WHEN CONCAT(YEAR(CURRENT_DATE()), '-', LPAD(MONTH(CURRENT_DATE()), 2, '0')) >= CONCAT(YEAR(CURRENT_DATE()), '-02') THEN YEAR(c.r_rubber_date)
                ELSE YEAR(c.r_rubber_date) - 1
                END) AS r_rubber_year,
                Max(u_share_id) AS u_share_id, 
                a.u_number, 
                MAX(a.u_title) AS u_title,
                MAX(a.u_firstname) AS u_firstname,
                MAX(a.u_lastname) AS u_lastname,
                MAX(CONCAT(a.u_address ,' ต.',g.name_in_thai,' อ.',f.name_in_thai,' จ.',e.name_in_thai, ' ', g.zip_code)) AS u_address,
                MAX(a.u_share) AS u_share, 
                ROUND(COALESCE(Max(d.s_percent),0),2) AS percent,
                ROUND(COALESCE(Sum(a.u_share*d.s_percent/100),0),2) AS Sumpercentshare,
                ROUND(COALESCE(Sum(b.w_weigth),0),2) AS Sumweight,
                ROUND(COALESCE(Max(d.s_huatun),0),2) AS percent_yang,
                ROUND(COALESCE(Sum((d.s_huatun/1000)*b.w_weigth),0),2) AS sumhuatun, 
                ROUND(COALESCE(Sum((a.u_share*d.s_percent/100)+(d.s_huatun/1000)*b.w_weigth),0),2) AS sumPrice
            FROM kanyangDB.Users a
            LEFT JOIN kanyangDB.weight_price b  ON a.u_number = b.u_number
            LEFT JOIN kanyangDB.rubber_price c  ON b.r_number = c.r_number
            LEFT JOIN kanyangDB.share_percent d ON year(c.r_rubber_date) = d.s_year
            INNER JOIN kanyangDB.provinces e 	ON e.id = a.provinces_id
            INNER JOIN kanyangDB.districts f    ON f.id = a.districts_id
            INNER JOIN kanyangDB.subdistricts g ON g.id = a.subdistricts_id
            WHERE c.r_rubber_date >= ? AND c.r_rubber_date <= ? AND a.u_firstname like ?
            GROUP BY a.u_number
            order by a.u_number asc`, [yearStart, yearEnd, '%' + Data.u_username + '%'])

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