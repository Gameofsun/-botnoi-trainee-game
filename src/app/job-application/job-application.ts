import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-application.html', // อิงตามชื่อไฟล์ที่คุณใช้
  styleUrls: ['./job-application.css']   // อิงตามชื่อไฟล์ที่คุณใช้
})
export class DashboardComponent { // คุณตั้งชื่อ class ไว้แบบนี้

  // ข้อมูลเมนู 4 ช่อง (ตามรูป)
  menus = [
    { 
      title: 'จัดการชั้นเรียน', sub: 'Manage Classes', 
      icon: '🎓', color: 'bg-blue', 
      status: '3 Active', statusColor: 'dot-green' 
    },
    { 
      title: 'รายชื่อนักเรียน', sub: 'Student List', 
      icon: '👥', color: 'bg-orange', 
      status: '450 Total', statusIcon: '👤' 
    },
    { 
      title: 'บันทึกคะแนน', sub: 'Grade Submission', 
      icon: '📝', color: 'bg-purple', 
      status: '2 Pending', statusBadge: true 
    },
    { 
      title: 'ตารางสอน', sub: 'Schedule', 
      icon: '📅', color: 'bg-sky', 
      status: 'Next: 13:30', statusColor: 'text-gray' 
    }
  ];

  // ข้อมูลกิจกรรมล่าสุด (Timeline)
  activities = [
    {
      time: '09:00', period: 'AM',
      subject: 'คณิตศาสตร์ 101', desc: 'Mathematics Fundamentals',
      code: 'MATH101', room: 'Room 402', status: 'In 30 min',
      theme: 'blue', isUpcoming: true
    },
    {
      time: '11:00', period: 'AM',
      subject: 'ฟิสิกส์ปฏิบัติการ', desc: 'Physics Laboratory',
      code: 'PHY202', room: 'Lab 3', status: '',
      theme: 'orange', isUpcoming: false
    },
    {
      time: '13:30', period: 'PM',
      subject: 'คาบที่ปรึกษา', desc: 'Advisory Period',
      code: 'ADV', room: 'Room 101', status: '',
      theme: 'purple', isUpcoming: false
    }
  ];
}