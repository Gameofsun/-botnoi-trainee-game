// 1. ข้อมูลดิบ (สมมติว่ารับมาจาก Database หรือ JSON)
export interface RawUser {
  id: number;
  fname: string;     // ชื่อจริง
  lname: string;     // นามสกุล
  role: string;      // ตำแหน่ง (admin, user)
  salary: number;    // เงินเดือน (ตัวเลขเพียวๆ)
  active: boolean;   // สถานะ (true/false)
}

// 2. ข้อมูลที่แต่งหน้าทาปากแล้ว (สำหรับโชว์หน้าเว็บ)
export interface DisplayUser {
  id: number;
  fullName: string;  // เอาชื่อ+นามสกุลมารวมกัน
  position: string;  // แปลง role ให้ตัวใหญ่ขึ้น
  income: string;    // ใส่ลูกน้ำและหน่วยบาท
  statusColor: string; // สีสถานะ (เขียว/แดง)
  statusText: string;  // ข้อความสถานะ (Active/Inactive)
  username?: string;   // username
  gender?: string;     // เพศ
  address?: string;    // ที่อยู่รวม (ถนน + เมือง)
  university?: string; // มหาวิทยาลัย
  company?: string;    // ชื่อบริษัท
  jobTitle?: string;   // ตำแหน่งงาน

}