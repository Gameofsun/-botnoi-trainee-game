import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  registerForm: FormGroup;
  fileName: string = ''; 

  constructor(private router: Router, private fb: FormBuilder) {
    // กำหนดให้ "ทุกช่อง" เป็น Required (บังคับกรอก)
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.minLength(9),  // ไม่ต่ำกว่า 9
        Validators.maxLength(10), // ไม่เกิน 10
        Validators.pattern(/^0[0-9]*$/) // Regular Expression: ต้องขึ้นต้นด้วย 0 และตามด้วยตัวเลขเท่านั้น
      ]],
      birthDate: ['', Validators.required], // เพิ่มบังคับ
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],   // เพิ่มบังคับ
      workplace: ['', Validators.required], // เพิ่มบังคับ
      school: ['', Validators.required]     // เพิ่มบังคับ
    });
  }

  // ฟังก์ชันเช็ค Error (ใช้ใน HTML)
  isInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    // เป็นจริงเมื่อ: ข้อมูลผิด AND (เคยคลิกแล้ว OR กดปุ่มยืนยันแล้ว)
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  setGender(value: string) {
    this.registerForm.patchValue({ gender: value });
    this.registerForm.get('gender')?.markAsTouched();
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    }
  }

  goToLogin() {
    // ตรวจสอบว่าฟอร์ม "Valid" (กรอกครบทุกช่อง) หรือไม่
    if (this.registerForm.valid) {
      console.log('Success:', this.registerForm.value);
      this.router.navigate(['/login']);
    } else {
      // ถ้าไม่ครบ: สั่งให้ทุกช่องแดงขึ้นมา
      this.registerForm.markAllAsTouched();
      // alert('กรุณากรอกข้อมูลให้ครบทุกช่อง'); // เปิดบรรทัดนี้ถ้าต้องการ Alert
    }
  }
}