import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  // ข้อมูลจำลองของ User (เปลี่ยนตรงนี้ ข้อมูลในหน้าจอจะเปลี่ยนตาม)
  userProfile = {
    name: 'สมชาย ใจดีมาก',
    role: 'ผู้สมัครงาน',
    image: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg', // ใช้รูปเดิมเพื่อให้ต่อเนื่อง
    
    // ข้อมูลส่วนตัว
    gender: 'ชาย',
    birthDate: '15 พฤษภาคม 2542',
    
    // ข้อมูลติดต่อ
    email: 'somchai.j@example.com',
    phone: '081-234-5678',
    address: '123/45 หมู่บ้านสวยงาม ซอยสุขุมวิท 21 เขตวัฒนา กรุงเทพมหานคร 10110',
    
    // การศึกษา
    university: 'มหาวิทยาลัยเกษตรศาสตร์',
    preferredLocation: 'สำนักงานใหญ่ (กรุงเทพฯ)',
    
    // เอกสาร
    transcriptFile: 'Transcript_Somchai_J.pdf',
    uploadDate: '12 ต.ค. 2566',
    fileSize: '2.4 MB'
  };

  constructor(private router: Router) {}

  // ฟังก์ชันกดปุ่มย้อนกลับ (<)
  goBack() {
    // ย้อนกลับไปหน้า Dashboard หรือหน้าที่แล้วแต่
    this.router.navigate(['/dashboard']); 
  }

  // ฟังก์ชันกดปุ่ม Edit (ดินสอ)
  onEdit() {
    alert('เปิดหน้าแก้ไขข้อมูล (Feature นี้ยังไม่เปิดใช้งาน)');
  }

  // ฟังก์ชัน Logout
  logout() {
    const confirmLogout = confirm('คุณต้องการออกจากระบบใช่หรือไม่?');
    if (confirmLogout) {
      // ลบ Token หรือ Clear session ตรงนี้ (ถ้ามี)
      this.router.navigate(['/login']);
    }
  }
}