const Messages = require('../config/messages')
const WeightModel = require('../models/weightModel')
const excel = require('exceljs');

class WeightController {

    static async CreateWeightprice(req, res) {
        try {
            const { w_weigth, u_number, r_number, w_admin } = req.body
            const weigthData = { w_weigth, u_number, r_number, w_admin }
            const data = await WeightModel.create(weigthData)
            if (data.count > 0)
                res.status(400).json({ status: Messages.ok, message: Messages.exists + data.user_fullname + '/' + data.r_around + '/(' + data.r_rubber_date.toLocaleDateString('es-CL') + ')' })
            else
                res.status(200).json({ status: Messages.ok, data: data, message: Messages.insertSuccess })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }

    }

    static async UpdateWeightprice(req, res) {
        try {
            const { w_number } = req.params

            const { w_weigth, r_number, w_price, u_number, w_admin } = req.body
            const weigthData = { w_weigth, r_number, w_price, u_number, w_admin }
            const data = await WeightModel.update(weigthData, w_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data, message: Messages.updateSuccess })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async DeleteWeightprice(req, res) {
        try {
            const { w_number } = req.params

            const data = await WeightModel.delete(w_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data, message: Messages.deleteSuccess })
            else
                res.status(400).json({ status: Messages.deleteFailed, message: error.message })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async GetWeightpriceAll(req, res) {
        try {
            const { r_number, u_firstname, page = 1, limit = 5 } = req.body;
            const offset = (page - 1) * limit;

            const Data = { r_number, u_firstname, limit, offset };
            const { result, totalRecords, totalPages } = await WeightModel.getAll(Data);

            const sanitizedData = result.map(({ u_password, ...rest }) => rest);

            res.status(200).json({
                status: Messages.ok,
                data: sanitizedData,
                page,
                limit,
                totalRecords,
                totalPages
            });
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }


    static async GetWeightpriceById(req, res) {
        try {
            const { w_number } = req.params
            const data = await WeightModel.getById(w_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async GetWeightUserById(req, res) {
        try {
            const { u_number } = req.params

            const data = await WeightModel.getUserById(u_number)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async ExportExcelWeightprice(req, res) {
        try {
            const { r_number, u_firstname } = req.body
            const Data = { r_number, u_firstname }


            const data = await WeightModel.getAll(Data)

            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet("ShareData");

            //EXCEL:HREADER
            worksheet.mergeCells('A1:H1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = 'รายการขายยางพาราประจำเดือน 2024/05'
            titleCell.font = { name: "Angsana New", bold: true, size: 20 };
            titleCell.alignment = { horizontal: 'center' };

            // เพิ่มหัวเรื่อง (Headers) ที่ A2:N2 เป็น columns header
            const headers = ['ID', 'งวด', 'วันที่ขาย', 'น้ำหนักรวม', 'ราคาประมูล', 'จำนวนเงิน', 'สมาชิก', 'วันที่บันทึก'];
            worksheet.addRow(headers);

            // column
            worksheet.columns.forEach(column => { column.width = 20; })

            // AUTOFILTER
            worksheet.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: 8 } }

            // STYLES
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { name: "Angsana New", size: 15, bold: true, color: { argb: "FFFFFFF" } };
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1B5D3E" } };
                cell.alignment = { vertical: "top", wrapText: true };
            });

            //  BODY
            data.forEach(row => {
                const rowData = [
                    row.w_number,
                    row.r_around,
                    row.r_rubber_date,
                    row.w_weigth,
                    row.r_rubber_price,
                    row.w_price,
                    row.username,
                    row.w_datetime
                ];
                worksheet.addRow(rowData).eachCell({ includeEmpty: true }, (cell) => {
                    cell.font = { name: "Angsana New", size: 15 };
                    cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
                    cell.alignment = { vertical: "top", wrapText: true };
                })
            })

            // ส่งไฟล์ Excel กลับไปยังผู้ใช้งาน
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader('Content-Disposition', 'attachment; filename=sall_yangpara' + Date.now() + '.xlsx');
            await workbook.xlsx.write(res).then(() => {
                res.end();
            });


        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }




}

module.exports = WeightController


