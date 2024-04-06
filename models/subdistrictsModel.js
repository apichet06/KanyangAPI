const db = require('../config/db')
const Messages = require('../config/messages')


class SubdistrictsModels {

    static async subdistrictsID(district_id) {
        try {

            const [result] = await db.query('SELECT * FROM subdistricts WHERE district_id = ?', [district_id])
            if (result)
                return result
            else
                throw new Error(Messages.notFound)

        } catch (error) {
            throw error
        }
    }

}
module.exports = SubdistrictsModels