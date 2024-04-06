const Messages = require('../config/messages');
const districtsModel = require('../models/districtsModel')

class DistrictsController {

    static async GetDistricts(req, res) {
        try {
            const { province_id } = req.params
            const district = await districtsModel.DistrictsID(province_id)
            if (district)
                res.status(200).json({ status: "ok", data: district })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }

    }

}

module.exports = DistrictsController;