import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './job-application.html',
  styleUrls: ['./job-application.css'],
})
export class JobApplication {
  loginForm: FormGroup;

  private readonly passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(this.passwordPattern),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.passwordMatchValidator] } // ตรวจให้ password ตรงกับ confirmPassword
    );
  }

  // ใช้ใน HTML: isInvalid('password')
  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // ให้ error ไปอยู่ที่ confirmPassword จะได้โชว์ใต้ช่องยืนยันรหัสผ่านได้ง่าย
  private passwordMatchValidator = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (!password || !confirm) return null;

    if (password !== confirm) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // ถ้าตรงกันแล้ว เคลียร์ error passwordMismatch (แต่ต้องไม่ไปลบ error อื่น)
    const confirmCtrl = group.get('confirmPassword');
    if (confirmCtrl?.hasError('passwordMismatch')) {
      const errors = { ...(confirmCtrl.errors || {}) };
      delete errors['passwordMismatch'];
      confirmCtrl.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  };

  onRegister(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // ให้ error โชว์ครบ
      return;
    }

    // TODO: ส่งค่าไป API สมัครสมาชิกได้ที่นี่
    // const payload = this.loginForm.value;

    this.router.navigate(['/success']);
  }
  
  onCancel() {
  this.loginForm.reset();
  this.router.navigate(['/login']);
  }


}