const rubberMudel = require('../models/rubberpriceModel')
const Messages = require('../config/messages')


class rubberController {

    static async CreateRubberPrice(req, res) {
        try {
            const { r_rubber_price, r_rubber_date, u_number } = req.body
            const rubberData = {
                r_rubber_price, r_rubber_date, u_number
            }

            const rubber_Price = await rubberMudel.create(rubberData)
            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, rubber_Price })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }


    static async updateRubberPrice(req, res) {
        try {
            const { r_number } = req.params;
            const { r_rubber_price, r_rubber_date } = req.body
            const rubberData = {
                r_rubber_price, r_rubber_date
            }

            const rubber_Price = await rubberMudel.update(rubberData, r_number)
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, rubber_Price })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }


    static async DeleteRubberPrice(req, res) {
        try {
            const { r_number } = req.params;

            const data = await rubberMudel.delete(r_number)

            if (data.rowCount > 0)
                res.status(400).json({ status: Messages.ok, message: Messages.used })
            else
                res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }


    static async ShowRubberPriceAll(req, res) {
        try {
            const RubberPrice = await rubberMudel.GetrubberpriceAll();
            if (RubberPrice) {
                res.status(200).json({ status: Messages.ok, data: RubberPrice });
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
    static async ShowRubberPriceById(req, res) {
        try {
            const { r_number } = req.params;
            const RubberPrice = await rubberMudel.getById(r_number);
            if (RubberPrice) {
                res.status(200).json({ status: Messages.ok, data: RubberPrice });
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async RubberPriceChart(req, res) {
        try {
            // const Year = new Date().getFullYear();
            const { Year } = req.params;
            const data = await rubberMudel.getChart({ Year });
            if (data) {
                res.status(200).json({ status: Messages.ok, data: data });
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async ChartYear(req, res) {
        try {
            const data = await rubberMudel.getChartYear();
            if (data) {
                res.status(200).json({ status: Messages.ok, data: data });
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}




module.exports = rubberController;


