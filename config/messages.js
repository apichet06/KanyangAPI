class Messages {

    static insertSuccess = "บันทีกข้อมูลสำเร็จ!";
    static updateSuccess = "อับเดทข้อมูลสำเร็จ!";
    static deleteSuccess = "ลบข้อมูลสำเร็จ!";

    static deleteFailed = "ลบข้อมูลไม่สำเร็จ!";
    static updateFailed = "แก้ไขข้อมูลไม่สำเร็จ!";
    static exists = "ข้อมูลนี้มีอยู่แล้ว : ";

    static idNotFound = "ไม่พบรหัสที่ระบุครับ!";
    static userNotFound = "ไม่พบข้อมูลผู้ใช้";
    static notFound = "ไม่พบข้อมูล";
    static repeatEmail = "มีผู้ใช้ Email นี้อยู่แล้ว!";
    static error500 = "Server Error!";
    static error = "Error";
    static invalidPassword = "รหัสผ่านไม่ถูกต้อง!";
    static dataUnlinkError = "ไม่สามารถลบไฟล์ได้!";
    static dataUnlinkSuccess = "ลบไฟล์สำเร็จ!";
    static invalidToken = "Invalid token, โทเค็นไม่ถูกต้อง";
    static notToken = "Authentication token is missing, ไม่มีโทเค็นการตรวจสอบสิทธิ์";

}

module.exports = Messages