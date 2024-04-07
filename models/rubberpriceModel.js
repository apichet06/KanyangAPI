const db = require('../config/db');
const Messages = require('../config/messages');


class rubber_priceModel {



    static async generaterubber_price() {
        try {
            const [result] = await db.query('SELECT MAX(r_number) as maxId FROM rubber_price');
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(1)) + 1;
                console.log(idNumber);
                const nextId = `R${idNumber.toString().padStart(7, '0')}`;
                return nextId;
            } else {
                return 'R10000001';
            }
        } catch (error) {
            throw error;
        }
    }

    static async create(rubberData) {
        try {
            const nextId = await this.generaterubber_price();

            rubberData.r_number = nextId;

            const [result] = await db.query('INSERT INTO rubber_price SET ?', rubberData);
            const [rubber] = await db.query('SELECT * FROM rubber_price WHERE id= ?', result.insertId)
            if (rubber)
                return rubber

        } catch (error) {
            throw error
        }

    }
    static async update(rubberData, r_number) {
        try {

            const [result] = await db.query("UPDATE rubber_price SET ? Where r_number = ? ", [rubberData, r_number]);

            const [rubber] = await db.query('SELECT * FROM rubber_price WHERE r_number = ?', r_number);

            if (result)
                return rubber;
            else
                throw new Error(Messages.updateFailed);

        } catch (err) {
            return error.message;
        }

    }

    static async delete(r_number) {

        try {
            const [result] = await db.query('DELETE FROM rubber_price WHERE  r_number = ?', [r_number])
            // console.log(result.affectedRows); 
            return result.affectedRows;
        } catch (error) {
            throw error;
        }

    }
    static async GetrubberpriceAll() {

        try {
            const [result] = await db.query('SELECT * FROM rubber_price order by r_number desc');
            if (result) {
                return result;
            } else {
                throw new Error(Messages.deleteFailed)
            }
        } catch (error) {
            throw error;
        }
    }


}
module.exports = rubber_priceModel;