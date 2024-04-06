const db = require('../config/db');
const Messages = require('../config/messages');

class DistrctsModel {

    static async DistrictsID(province_id) {

        try {
            const [result] = await db.query('SELECT * FROM districts where province_id = ?', [province_id]);
            if (result) {
                return result;
            } else {
                throw new Error(Messages.notFound)
            }
        } catch (error) {

            throw error;

        }

    }

}

module.exports = DistrctsModel;