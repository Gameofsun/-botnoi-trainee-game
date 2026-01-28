import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = {
    username: '',
    password: '',
    remember: false
  };

  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$';

  constructor(
    private router: Router,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    // เช็คว่าเคยจำ user ไว้ไหม
    const saved = localStorage.getItem('remember_username');
    if (saved) {
      this.model.username = saved;
      this.model.remember = true;
    }
  }

  onLogin(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // เรียกใช้ API จำลอง
    this.authService.login({ 
      username: this.model.username, 
      password: this.model.password 
    }).subscribe({
      next: (isValid) => {
        if (isValid) {
          this.fetchUserProfileAndRedirect(this.model.username);
        } else {
          alert('Username หรือ Password ไม่ถูกต้อง');
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
      }
    });
  }

  private fetchUserProfileAndRedirect(username: string) {
    this.authService.getProfile(username).subscribe(profile => {
      if (profile) {
        // บันทึกข้อมูลลง Session
        sessionStorage.setItem('token', 'mock-jwt-token-123'); 
        sessionStorage.setItem('session_user', profile.username); 
        sessionStorage.setItem('session_role', profile.role); 
        sessionStorage.setItem('session_fullname', profile.fullName);
        
        // จัดการ Remember Me เอาออก
        if (this.model.remember) {
           localStorage.setItem('token', 'mock-jwt-token-123');
           localStorage.setItem('remember_username', username);
        } else {
           localStorage.removeItem('token');
           localStorage.removeItem('remember_username');
        }

        // ไปหน้า Main
        this.router.navigate(['/main']);
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']); 
  }
}