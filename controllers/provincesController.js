const Messages = require("../config/messages");
const ProvincesModels = require('../models/provincesModel');

class ProvincesController {
    static async GetProvinces(req, res) {
        try {
            const provinces = await ProvincesModels.provincesAll()
            if (provinces)
                res.status(200).json({ status: "ok", data: provinces })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}

module.exports = ProvincesController;