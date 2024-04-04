const Provinces = require('../models/provincesModel');
const Messages = require("../config/messages");

class ProvincesController {
    static async GetProvinces(req, res) {
        try {
            const provinces = await Provinces.provincesAll()
            if (provinces)
                res.status(200).json({ status: "ok", data: provinces })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}

module.exports = ProvincesController;