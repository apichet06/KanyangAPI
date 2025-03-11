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

    static async generaterubber_around(date) {
        try {

            const parts = date.split('-');
            const year = parts[0]; // ส่วนแรกคือปี
            const month = parts[1];

            const [result] = await db.query('SELECT MAX(r_around) as maxId FROM rubber_price WHERE YEAR(r_rubber_date) = ? AND MONTH(r_rubber_date) = ?', [year, month])
            const currentMaxId = result[0].maxId || '0'
            const MaxIdNumber = parseInt(currentMaxId.slice(0)) + 1;

            return MaxIdNumber;
        } catch (error) {
            throw error;
        }
    }

    static async create(rubberData) {
        try {


            const nextId = await this.generaterubber_price();
            const around = await this.generaterubber_around(rubberData.r_rubber_date);

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
            const [checkrerepeat] = await db.query("SELECT count(*) AS rowCount FROM weight_price WHERE r_number = ?", [r_number]);
            if (checkrerepeat[0].rowCount > 0) {
                return checkrerepeat[0];
            }

            const [result] = await db.query('DELETE FROM rubber_price WHERE  r_number = ?', [r_number]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }


    static async GetrubberpriceAll() {

        try {
            const [result] = await db.query(`SELECT CONCAT(b.u_title,b.u_firstname,' ',b.u_lastname)as username,a.* 
              FROM nongpa_db.rubber_price a 
              inner join nongpa_db.users b on a.u_number = b.u_number order by r_rubber_date desc`);
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

    static async getChart(data) {
        try {

            const [result] = await db.query(`
            SELECT a.id, a.m_number, a.m_name, bx.r_rubber_date, bx.r_rubber_price,bx.r_around
            FROM nongpa_db.months a
            LEFT JOIN (
                SELECT r_rubber_date,r_rubber_price,r_around 
                FROM nongpa_db.rubber_price 
                WHERE YEAR(r_rubber_date) = ?
            ) AS bx
            ON MONTH(bx.r_rubber_date) = a.m_number`, [data.Year]);

            if (result) {
                const finalResult = Object.values(result.reduce((acc, { r_around, m_number, m_name, r_rubber_date, r_rubber_price }) => {
                    if (!acc[m_number]) {
                        acc[m_number] = { m_number, m_name, data: [] };
                    }
                    if (r_rubber_date && r_rubber_price) {
                        acc[m_number].data.push({ r_around, r_rubber_date, r_rubber_price });
                    }
                    return acc;
                }, {})).sort((a, b) => parseInt(a.m_number) - parseInt(b.m_number));

                return finalResult;
            }
        } catch (error) {
            throw error
        }
    }
    static async getChartYear() {

        try {
            const [result] = await db.query(`SELECT YEAR(r_rubber_date) as Year FROM rubber_price GROUP BY YEAR(r_rubber_date)`);
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