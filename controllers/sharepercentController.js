const sharepercentModel = require('../models/sharepercentModel')
const Messages = require('../config/messages')
const excel = require('exceljs');

class SharepercentController {
    static async CreateSharepercent(req, res) {
        try {
            const { s_year, s_percent, s_huatun } = req.body
            const sharepercentData = { s_year, s_percent, s_huatun }


            const [year] = await sharepercentModel.GetByYear(s_year)

            if (year)
                return res.status(400).json({ status: Messages.error, message: Messages.exists + s_year })

            const Data = await sharepercentModel.create(sharepercentData)

            if (Data)
                res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }


    }
    static async UpdateSharepercent(req, res) {
        try {
            const { id } = req.params
            const { s_year, s_percent, s_huatun } = req.body
            const sharepercentData = { s_year, s_percent, s_huatun }
            const Data = await sharepercentModel.update(sharepercentData, id)

            if (!Data)
                res.status(400).json({ status: Messages.error, message: Messages.updateFailed })
            else
                res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async DeleteSharepercent(req, res) {
        try {
            const { id } = req.params
            const Data = await sharepercentModel.delete(id)

            if (!Data)
                res.status(400).json({ status: Messages.error, message: Messages.deleteFailed })
            else
                res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
    static async GetSharepercent(req, res) {
        try {
            const { id } = req.params
            const Data = await sharepercentModel.GetAll(id)
            if (Data)
                res.status(200).json({ status: Messages.ok, data: Data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async SearchShare(req, res) {
        try {
            const { year, u_username } = req.body
            const searchData = { year, u_username }

            const data = await sharepercentModel.PostShare(searchData)
            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }


    static async UpdateshareYear(req, res) {
        try {
            const Year = new Date().getFullYear();

            const data = await sharepercentModel.Update_shareYear({ Year });

            if (data)
                res.status(200).json({ status: Messages.ok, data: data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }




    static async ExportShareToExcel(req, res) {
        try {
            const { year, u_username } = req.body
            const searchData = { year, u_username }

            // ====================== คำควณเวลา ===============================
            const isLeap = await sharepercentModel.isLeapYear(parseInt(year) + 1);
            const lastDay = isLeap ? 29 : 28;

            const currentDate = new Date().getFullYear();
            const yearStart = year === '' ? `${currentDate}-03-01` : `${year}-03-01`;
            const yearEnd = year === '' ? `${currentDate + 1}-02-${lastDay}` : `${parseInt(year) + 1}-02-${lastDay}`;
            // ================================================================

            const data = await sharepercentModel.PostShare(searchData);

            // สร้าง Excel
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet("ShareData");

            //EXCEL:HREADER
            worksheet.mergeCells('A1:N1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = 'รายงานปันผลหุ้นประจำปี' + ' ' + yearStart + ' ถึง ' + yearEnd;
            titleCell.font = { name: "Angsana New", bold: true, size: 20 };
            titleCell.alignment = { horizontal: 'center' };

            // เพิ่มหัวเรื่อง (Headers) ที่ A2:N2 เป็น columns header
            const headers = ['ปีปันผล', 'เลขหุ่น', 'รหัสสมาชิก', 'คำนำหน้า', 'ชื่อ', 'สกุล', 'ที่อยู่', 'จำนวนหุ้น', 'เปอร์เซ็นปันผลหุ้น', 'เงินปันผลหุ้น', 'น้ำหนักหัวตัน', 'เปอร์เซ็นปันผลหัวตัน', 'เงินปันผลหัวตัน', 'เงินปันผลรวม'];
            worksheet.addRow(headers);

            // column
            worksheet.columns.forEach(column => { column.width = 18; })

            // AUTOFILTER
            worksheet.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: worksheet.actualColumnCount } }

            // STYLES
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { name: "Angsana New", size: 15, bold: true, color: { argb: "FFFFFFF" } };
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1B5D3E" } };
                cell.alignment = { vertical: "top", wrapText: true };
            });

            // เพิ่มข้อมูลลงใน Excel
            //  BODY
            data.forEach(row => {
                const rowData = [
                    row.r_rubber_year,
                    row.u_number,
                    row.u_share_id,
                    row.u_title,
                    row.u_firstname,
                    row.u_lastname,
                    row.u_address,
                    row.u_share,
                    row.percent,
                    row.Sumpercentshare,
                    row.Sumweight,
                    row.percent_yang,
                    row.sumhuatun,
                    row.sumPrice
                ];
                worksheet.addRow(rowData).eachCell({ includeEmpty: true }, (cell) => {
                    cell.font = { name: "Angsana New", size: 15 };
                    cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
                    cell.alignment = { vertical: "top", wrapText: true };
                })
            })

            // ส่งไฟล์ Excel กลับไปยังผู้ใช้งาน
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader('Content-Disposition', 'attachment; filename=share_Yangpara' + Date.now() + '.xlsx');
            await workbook.xlsx.write(res).then(() => {
                res.end();
            });


        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }


}

module.exports = SharepercentController