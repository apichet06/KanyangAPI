const db = require('../config/db')
const Messages = require('../config/messages')

class WeightModel {

    static async generateMaxId() {
        try {
            const currentDate = new Date();
            const [sql] = await db.query('SELECT max(w_number) as maxId FROM weight_price');
            // const maxId = sql[0].maxId || `W${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}000`;
            const maxId = sql[0].maxId || `W${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}000`;

            return `W${maxId.slice(1, 9)}${parseInt(maxId.slice(9)) + 1}`.padEnd(10, '0');
        } catch (error) {
            throw error;
        }
    }

    static async create(weightData) {

        try {
            const nextId = await this.generateMaxId()
            weightData.w_number = nextId;
            const [rubber] = await db.query(`SELECT r_rubber_price FROM rubber_price Where r_number = ?`, weightData.r_number)
            // console.log(rubber[0].r_rubber_price * weightData.w_weigth);
            weightData.w_price = rubber[0].r_rubber_price * weightData.w_weigth
            const [sql] = await db.query('INSERT INTO weight_price SET ? ', [weightData])
            const [weightprice] = await db.query('SELECT * FROM weight_price WHERE id = ? ', sql.insertId)

            return weightprice
        } catch (error) {
            throw error
        }

    }

    static async update(weightData, w_number) {
        try {
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

    static async getAll() {
        try {
            const [result] = await db.query(`
            SELECT * FROM kanyangDB.weight_price a
            inner join kanyangDB.Users b
            on a.u_number = b.u_number
            inner join kanyangDB.provinces c 
            on c.id = b.provinces_id
            inner join kanyangDB.districts d 
            on d.id = b.districts_id
            inner join kanyangDB.subdistricts e 
            on e.id = b.subdistricts_id`)
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



}

module.exports = WeightModel