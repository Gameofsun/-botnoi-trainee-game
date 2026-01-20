import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  fileName: string = ''; 
  gender: string = ''; // ตัวแปรเก็บค่าเพศ

  constructor(private router: Router) {}

  // ฟังก์ชันสำหรับเลือกเพศ (เพิ่มอันนี้เข้าไป)
  setGender(value: string) {
    this.gender = value;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    }
  }
}