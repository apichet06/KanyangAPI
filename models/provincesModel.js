const db = require("../config/db")
const Messages = require('../config/messages');

class ProvincesModels {

    static async provincesAll() {
        try {
            const [result] = await db.query('SELECT * FROM provinces');
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
module.exports = ProvincesModels;