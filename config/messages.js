class Messages {

    static insertSuccess = "บันทีกข้อมูลสำเร็จ!";
    static updateSuccess = "อับเดทข้อมูลสำเร็จ!";
    static deleteSuccess = "ลบข้อมูลสำเร็จ!";
    static ok = "ok";

    static deleteFailed = "ลบข้อมูลไม่สำเร็จ!";
    static updateFailed = "แก้ไขข้อมูลไม่สำเร็จ!";
    static exists = "ข้อมูลนี้มีอยู่แล้ว : ";

    static UndeleteUser = "ไม่สามารถลบข้อมูลที่เป็นแอดมินหลักได้!"
    static idNotFound = "ไม่พบรหัสที่ระบุครับ!";
    static userNotFound = "ไม่พบข้อมูลผู้ใช้";
    static notFound = "ไม่พบข้อมูล";
    static repeatEmail = "Email นี้มีอยู่แล้ว!";
    static used = "ไม่สามารถลบได้,ข้อมูลนี้ใช้งานอยู่"
    static error500 = "Server Error!";
    static error = "Error";
    static invalidPassword = "รหัสผ่านไม่ถูกต้อง!";
    static PasswordNotmatch = "รหัสผ่านเดิมไม่ถูกต้อง";
    static dataUnlinkError = "ไม่สามารถลบไฟล์ได้!";
    static dataUnlinkSuccess = "ลบไฟล์สำเร็จ!";
    static invalidToken = "Invalid token, โทเค็นไม่ถูกต้อง";
    static notToken = "Authentication token is missing, ไม่มีโทเค็นการตรวจสอบสิทธิ์";

}

module.exports = Messages