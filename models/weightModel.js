const db = require('../config/db')
const Messages = require('../config/messages')

class WeightModel {

    static async generateMaxId() {

        try {
            const currentDate = new Date();
            const [result] = await db.query('SELECT max(w_number) as MaxId FROM weight_price')
            const currentMaxId = result[0].MaxId || `W${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}000`;

            const idNumber = parseInt(currentMaxId.slice(1)) + 1
            return "W" + idNumber.toString().padStart(3, '0')
        } catch (error) {
            throw error
        }

    }

    static async create(weightData) {
        try {
            const nextId = await this.generateMaxId()

            weightData.w_number = nextId;
            const [rubber] = await db.query(`SELECT r_rubber_price FROM rubber_price WHERE r_number = ?`, weightData.r_number)
            weightData.w_price = rubber[0].r_rubber_price * weightData.w_weigth


            const [checkreplace] = await db.query(`
            SELECT COUNT(a.id) AS count, max(concat(b.u_title, b.u_firstname, ' ', b.u_lastname)) AS user_fullname,c.r_around,r_rubber_date
                FROM nongpa_db.weight_price a 
                INNER JOIN nongpa_db.users b ON a.u_number = b.u_number
                INNER JOIN nongpa_db.rubber_price c ON a.r_number = c.r_number  
                WHERE a.r_number = ? AND a.u_number = ?
                GROUP BY b.u_title, b.u_firstname , b.u_lastname,c.r_around,c.r_rubber_date
            `, [weightData.r_number, weightData.u_number]);

            if (checkreplace && checkreplace.length > 0) {

                return checkreplace[0]

            } else {

                // ไม่มีค่าซ้ำ
                const [sql] = await db.query('INSERT INTO weight_price SET ?', [weightData])
                const [weightprice] = await db.query('SELECT * FROM weight_price WHERE id = ?', sql.insertId)
                return weightprice;
            }
        } catch (error) {
            throw error;
        }
    }


    static async update(weightData, w_number) {
        try {
            const [rubber] = await db.query(`SELECT r_rubber_price FROM rubber_price Where r_number = ?`, weightData.r_number)

            weightData.w_price = rubber[0].r_rubber_price * weightData.w_weigth

            const [result] = await db.query("UPDATE weight_price SET ? Where w_number = ? ", [weightData, w_number])
            const [weightprice] = await db.query('SELECT * FROM weight_price WHERE w_number = ?', w_number)

            if (result)
                return weightprice
            else
                throw new Error(Messages.updateFailed)
        } catch (error) {
            throw error
        }
    }
    static async delete(w_number) {
        try {
            const [sql] = await db.query("DELETE FROM weight_price WHERE w_number=?", w_number)
            return sql.affectedRows
        } catch (error) {
            throw error
        }
    }


    static async getAll(body) {
        try {


            const [[countResult]] = await db.query(`
                SELECT COUNT(*) AS total FROM nongpa_db.weight_price a
                INNER JOIN nongpa_db.users b ON a.u_number = b.u_number
                WHERE a.r_number = ? AND (b.u_firstname LIKE ? OR b.u_number LIKE ?)`,
                [
                    body.r_number,
                    '%' + body.u_firstname + '%',
                    '%' + body.u_firstname + '%'
                ]
            );

            const totalRecords = countResult.total;
            const totalPages = Math.ceil(totalRecords / body.limit);

            const [result] = await db.query(`
                SELECT w_number, f.r_number, r_around, b.u_share_id, r_rubber_price, w_weigth, w_price, 
                       a.u_number, CONCAT(b.u_title, b.u_firstname, ' ', b.u_lastname) AS username,
                       CONCAT(b.u_address, ' ต.', e.name_in_thai, ' อ.', d.name_in_thai, ' จ.', c.name_in_thai, ' ', zip_code) AS Address,
                       CONCAT(g.u_title, g.u_firstname, ' ', g.u_lastname) AS uadmin, w_datetime, r_rubber_date
                FROM nongpa_db.weight_price a
                INNER JOIN nongpa_db.users b ON a.u_number = b.u_number
                INNER JOIN nongpa_db.provinces c ON c.id = b.provinces_id
                INNER JOIN nongpa_db.districts d ON d.id = b.districts_id
                INNER JOIN nongpa_db.subdistricts e ON e.id = b.subdistricts_id
                INNER JOIN nongpa_db.rubber_price f ON f.r_number = a.r_number
                INNER JOIN nongpa_db.users g ON g.u_number = a.w_admin
                WHERE a.r_number LIKE ? AND (b.u_firstname LIKE ? OR b.u_number LIKE ?)
                ORDER BY a.w_number DESC
                LIMIT ? OFFSET ?`,
                [
                    body.r_number,
                    '%' + body.u_firstname + '%',
                    '%' + body.u_firstname + '%',
                    Number(body.limit),
                    Number(body.offset)
                ]
            );

            return { result, totalRecords, totalPages };
        } catch (error) {
            throw error;
        }
    }



    static async getById(w_number) {
        try {
            const [result] = await db.query("SELECT * FROM weight_price WHERE w_number = ?", w_number)
            if (result)
                return result
            else
                throw new Error(Messages.notFound)
        } catch (error) {
            throw error
        }
    }

    static async getUserById(u_number) {

        try {
            const [result] = await db.query(`SELECT w_number,b.u_share_id,f.r_number,r_around,r_rubber_price,w_weigth,w_price,a.u_number,CONCAT(b.u_title,b.u_firstname,' ',b.u_lastname)as username,b.u_address,c.name_in_thai,d.name_in_thai,
                        d.name_in_thai,e.name_in_thai,zip_code,CONCAT(g.u_title,g.u_firstname,' ',g.u_lastname)as uadmin,w_datetime,r_rubber_date
                        FROM nongpa_db.weight_price a
                        inner join nongpa_db.users b
                        on a.u_number = b.u_number
                        inner join nongpa_db.provinces c 
                        on c.id = b.provinces_id
                        inner join nongpa_db.districts d 
                        on d.id = b.districts_id
                        inner join nongpa_db.subdistricts e 
                        on e.id = b.subdistricts_id
                        inner join nongpa_db.rubber_price f 
                        on f.r_number = a.r_number
                        inner join nongpa_db.users g
                        on g.u_number = a.w_admin
                        where b.u_number = ?
                        order by a.w_number desc`, [u_number])

            if (result)
                return result
            else
                throw new Error(Messages.notFound)
        } catch (error) {
            throw error
        }
    }



}





module.exports = WeightModel