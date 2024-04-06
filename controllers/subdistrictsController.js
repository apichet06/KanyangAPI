const subdistrictsModel = require('../models/subdistrictsModel');
const Messages = require('../config/messages');

class SubdistrictsController {

    static async GetSubdistricts(req, res) {

        try {
            const { district_id } = req.params

            const subdistricts = await subdistrictsModel.subdistrictsID(district_id)

            if (subdistricts)
                res.status(200).json({ status: 'ok', data: subdistricts })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }

    }

}

module.exports = SubdistrictsController;