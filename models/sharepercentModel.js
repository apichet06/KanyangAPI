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


    static async Update_shareYear(Year) {
        try {
            const [result] = await db.query(`SELECT u_number, u_share FROM nongpa_db.users WHERE u_share > 0 ORDER BY u_number ASC`);

            await Promise.all(result.map(async (item) => {
                const [existing] = await db.query(`SELECT 1 FROM share WHERE u_number = ? AND year = ?`, [item.u_number, Year.Year]);

                if (existing.length) {
                    await db.query(`UPDATE share SET u_share = ? WHERE u_number = ? AND year = ?`, [item.u_share, item.u_number, Year.Year]);
                } else {
                    await db.query(`INSERT INTO share (u_number, u_share, year) VALUES (?, ?, ?)`, [item.u_number, item.u_share, Year.Year]);
                }
            }));

            return 1;
        } catch (error) {
            throw error;
        }
    }




    static async isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }


    static async PostShare(Data) {
        try {

            const isLeap = await this.isLeapYear(Data.year);
            const lastDay = isLeap ? 29 : 28;

            const currentYear = new Date().getFullYear();
            const yearStart = Data.year === '' ? `${currentYear}-02-${lastDay}` : `${Data.year}-02-${lastDay}`;
            const yearEnd = Data.year === '' ? `${currentYear + 1}-03-01` : `${parseInt(Data.year) + 1}-03-01`;



            const currentMonth = new Date().getMonth() + 1; // January is 0
            const currentDay = new Date().getDate();


            const year = Data.year === '' ? (currentMonth < 2 || (currentMonth === 2 && currentDay < lastDay)
                ? currentYear - 1 : currentYear) : parseInt(Data.year);



            const [result] = await db.query(
                `SELECT  
                MAX(CASE
                WHEN CONCAT(YEAR(CURRENT_DATE()), '-', LPAD(MONTH(CURRENT_DATE()), 2, '0')) >= CONCAT(YEAR(CURRENT_DATE()), '-02') THEN YEAR(c.r_rubber_date)
                ELSE YEAR(c.r_rubber_date) - 1
                END) AS r_rubber_year,
                Max(u_share_id) AS u_share_id,a.u_number, 
                MAX(a.u_title) AS u_title,
                MAX(a.u_firstname) AS u_firstname,
                MAX(a.u_lastname) AS u_lastname,
                MAX(CONCAT(a.u_address ,' ต.',g.name_in_thai,' อ.',f.name_in_thai,' จ.',e.name_in_thai, ' ', g.zip_code)) AS u_address,
                MAX(h.u_share) AS u_share, 
                ROUND(COALESCE(Max(d.s_percent),0),2) AS percent,
                ROUND(COALESCE(Max(h.u_share*d.s_percent/100),0),2) AS Sumpercentshare,
                ROUND(COALESCE(Sum(b.w_weigth),0),2) AS Sumweight,
                ROUND(COALESCE(Max(d.s_huatun),0),2) AS percent_yang,
                ROUND(COALESCE(Sum((d.s_huatun/1000)*b.w_weigth),0),2) AS sumhuatun, 
                ROUND(COALESCE(MAX(h.u_share * d.s_percent / 100)+SUM((d.s_huatun / 1000) * b.w_weigth), 0), 2) AS sumPrice
            FROM nongpa_db.Users a
            LEFT JOIN nongpa_db.weight_price b  ON a.u_number = b.u_number
            LEFT JOIN nongpa_db.rubber_price c  ON b.r_number = c.r_number
            LEFT JOIN nongpa_db.share_percent d ON year(c.r_rubber_date) = d.s_year
            INNER JOIN nongpa_db.provinces e 	ON e.id = a.provinces_id
            INNER JOIN nongpa_db.districts f    ON f.id = a.districts_id
            INNER JOIN nongpa_db.subdistricts g ON g.id = a.subdistricts_id
            INNER JOIN nongpa_db.share h 		ON h.u_number = a.u_number
            WHERE c.r_rubber_date >= ? AND c.r_rubber_date <= ? AND h.u_share > 0 AND h.year like ? AND (a.u_firstname like ? or a.u_number like ?)   
            GROUP BY a.u_number
            order by a.u_number asc`, [yearStart, yearEnd, '%' + year + '%', '%' + Data.u_username + '%', '%' + Data.u_username + '%'])

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

// SELECT
//   CASE
//      WHEN CONCAT(YEAR(CURRENT_DATE()), '-', LPAD(MONTH(CURRENT_DATE()), 2, '0')) >= CONCAT(YEAR(CURRENT_DATE()), '-02') THEN YEAR(x.r_rubber_date)
//      ELSE YEAR(x.r_rubber_date) - 1
//   END AS r_rubber_year,
//   x.r_rubber_date,
//   a.u_number,a.u_share_id,a.u_title,a.u_firstname,
//   a.u_lastname ,CONCAT(a.u_address ,' ต.',g.name_in_thai,' อ.',f.name_in_thai,' จ.',e.name_in_thai, ' ', g.zip_code)  AS u_address,x.x_year,
//   x.u_share,x.percent,ROUND(COALESCE((x.u_share*x.percent/100),0),2) as Sumpercentshare,
//   x.w_weigth,x.s_huatun,ROUND(COALESCE((x.w_weigth/1000)*x.s_huatun,0),2) as sumhuatun,
//   ROUND(COALESCE((x.u_share*x.percent/100) + (x.w_weigth/1000)*x.s_huatun,0),2) AS sumPrice
// FROM nongpa_db.Users a
// INNER JOIN (SELECT b.u_number, sum(b.w_weigth) as w_weigth,max(c.year) as x_year,max(s_percent) as percent ,max(s_huatun) as s_huatun,max(c.u_share) as u_share,max(a.r_rubber_date) as r_rubber_date
//     FROM nongpa_db.rubber_price a
// 	INNER JOIN nongpa_db.weight_price b
// 	ON a.r_number = b.r_number
//     INNER JOIN nongpa_db.share c
//     ON c.u_number = b.u_number
//     INNER JOIN nongpa_db.share_percent d
//     ON d.s_year =c.year
// 	Where a.r_rubber_date >= '2023-03-01' AND a.r_rubber_date <= '2024-02-28'  and c.year = 2023 -- and b.u_number = 'U10000054'
// 	group by b.u_number )as x
// ON x.u_number = a.u_number
// INNER JOIN nongpa_db.provinces e 	ON e.id = a.provinces_id
// INNER JOIN nongpa_db.districts f    ON f.id = a.districts_id
// INNER JOIN nongpa_db.subdistricts g ON g.id = a.subdistricts_id



