const db = require('../config/db');
const Messages = require('../config/messages');


class rubber_priceModel {



    static async generaterubber_price() {
        try {
            const [result] = await db.query('SELECT MAX(r_number) as maxId FROM rubber_price');
            const currentMaxId = result[0].maxId || 'R10000000'
            const idNumber = parseInt(currentMaxId.slice(1)) + 1;
            return `R${idNumber.toString().padStart(7, '0')}`;

        } catch (error) {
            throw error;
        }
    }

    static async generaterubber_around() {
        try {

            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const [result] = await db.query('SELECT MAX(r_around) as maxId FROM rubber_price WHERE YEAR(r_rubber_date) = ? AND MONTH(r_rubber_date) = ?', [currentYear, currentMonth])
            const currentMaxId = result[0].maxId || '0'
            const MaxIdNumber = parseInt(currentMaxId.slice(1)) + 1;
            return MaxIdNumber;
        } catch (error) {
            throw error;
        }
    }

    static async create(rubberData) {
        try {
            const nextId = await this.generaterubber_price();
            const around = await this.generaterubber_around();
            rubberData.r_number = nextId;
            rubberData.r_around = around;

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
                throw new Error(Messages.notFound)
            }
        } catch (error) {
            throw error;
        }
    }

    static async getById(r_number) {
        try {
            const [result] = await db.query('SELECT * FROM rubber_price WHERE r_number = ?', [r_number]);
            if (result)
                return result;
            else
                throw new Error(Messages.notFound)

        } catch (error) {
            throw error
        }
    }



}
module.exports = rubber_priceModel;