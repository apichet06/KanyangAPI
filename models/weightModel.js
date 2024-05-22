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
                FROM kanyangDB.weight_price a 
                INNER JOIN kanyangDB.Users b ON a.u_number = b.u_number
                INNER JOIN kanyangDB.rubber_price c ON a.r_number = c.r_number  
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

            const [result] = await db.query(`
            SELECT w_number,f.r_number,r_around,b.u_share_id,r_rubber_price,w_weigth,w_price,a.u_number,CONCAT(b.u_title,b.u_firstname,' ',b.u_lastname)as username,
            CONCAT(b.u_address,' ต.',e.name_in_thai,' อ.',d.name_in_thai,' จ.',c.name_in_thai,' ',zip_code) as Address,
            CONCAT(g.u_title,g.u_firstname,' ',g.u_lastname)as uadmin,w_datetime,r_rubber_date
            FROM kanyangDB.weight_price a
            inner join kanyangDB.Users b
            on a.u_number = b.u_number
            inner join kanyangDB.provinces c 
            on c.id = b.provinces_id
            inner join kanyangDB.districts d 
            on d.id = b.districts_id
            inner join kanyangDB.subdistricts e 
            on e.id = b.subdistricts_id
            inner join kanyangDB.rubber_price f 
            on f.r_number = a.r_number
            inner join kanyangDB.Users g
            on g.u_number = a.w_admin
            Where a.r_number like ? AND (b.u_firstname like ? Or b.u_number like ?)
            order by a.w_number desc`, ['%' + body.r_number + '%', '%' + body.u_firstname + '%', '%' + body.u_firstname + '%'])
            return result
        } catch (error) {
            throw error
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
                        FROM kanyangDB.weight_price a
                        inner join kanyangDB.Users b
                        on a.u_number = b.u_number
                        inner join kanyangDB.provinces c 
                        on c.id = b.provinces_id
                        inner join kanyangDB.districts d 
                        on d.id = b.districts_id
                        inner join kanyangDB.subdistricts e 
                        on e.id = b.subdistricts_id
                        inner join kanyangDB.rubber_price f 
                        on f.r_number = a.r_number
                        inner join kanyangDB.Users g
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