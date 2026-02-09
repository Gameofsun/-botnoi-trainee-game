import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Material Modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Spinner
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Snackbar

// Dialog Modules
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

// กำหนด Format วันที่ให้เป็นแบบไทย (DD/MM/YYYY)
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,       // สำหรับ Dialog
    MatProgressSpinnerModule, // สำหรับ Loading หมุนๆ
    MatSnackBarModule,        // สำหรับแจ้งเตือน
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' }, 
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, 
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
   registerForm: FormGroup;
   fileName: string = ''; 
   isSubmitted = false;
   isLoading = false; // ตัวแปรสำหรับเช็คสถานะ Loading
  
   constructor(
     private router: Router, 
     private fb: FormBuilder,
     private snackBar: MatSnackBar, // ฉีด SnackBar เข้ามา
     private dialog: MatDialog      // ฉีด Dialog เข้ามา
    ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10), Validators.pattern(/^0[0-9]*$/)]],
      birthDate: ['', Validators.required], 
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],   
      workplace: ['', Validators.required], 
      school: ['', Validators.required]     
    });
   }

   isInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
   
  setGender(value: string) {
    this.registerForm.patchValue({ gender: value });
    this.registerForm.get('gender')?.markAsTouched();
  }

  onFileSelect(event: any) {
  const file = event.target.files[0];
  const maxSizeInMB = 15;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // แปลง MB เป็น Bytes

  if (file) {
    // เช็คขนาดไฟล์
    if (file.size > maxSizeInBytes) {
      this.snackBar.open(`❌ ไฟล์มีขนาดใหญ่เกินไป (ห้ามเกิน ${maxSizeInMB}MB)`, 'ปิด', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      
      // ล้างค่าเดิมทิ้ง
      this.fileName = '';
      event.target.value = ''; // Reset input file
      return;
    }

    // ถ้าผ่านเงื่อนไขขนาดไฟล์
    this.fileName = file.name;
    
  }
}

  // ฟังก์ชันกดปุ่มยืนยันสมัคร (มี Loading + Snackbar)
  // ในไฟล์ register.component.ts

  goToLogin() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerForm.disable();

      setTimeout(() => {
        this.isLoading = false;
        this.isSubmitted = true;
        this.registerForm.enable();

        // ✅ 1. กรณีสำเร็จ (Success)
        // กรณีสำเร็จ (Success)
        this.snackBar.open('✅ สมัครสมาชิกสำเร็จ!', 'ตกลง', {
          duration: 3000,
          panelClass: ['success-snackbar'], // ต้องชื่อเดียวกับใน styles.css
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

        console.log('Success:', this.registerForm.value);
        this.router.navigate(['/success']); 
      }, 2000);

    } else {
      this.registerForm.markAllAsTouched();
      
      // ✅ 2. กรณีแจ้งเตือน Error
      // กรณีพลาด (Error)
        this.snackBar.open('❌ กรุณากรอกข้อมูลให้ครบถ้วน', 'ปิด', {
          duration: 3000,
          panelClass: ['error-snackbar'], // ต้องชื่อเดียวกับใน styles.css
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
    }
  }

  onlyNumber(event: any) {
    const value = (event.target.value || '').replace(/[^0-9]/g, '');
    event.target.value = value;
    this.registerForm.get('phone')?.setValue(value, { emitEvent: false });
  } 

  // ฟังก์ชันกดปุ่มยกเลิก (มี Confirm Dialog)
  onCancel() {
    // เช็คว่าฟอร์มมีการแก้ไขหรือยัง (Dirty)
    if (this.registerForm.dirty) {
      
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { 
          title: 'ยกเลิกการสมัคร?',
          message: 'ข้อมูลที่คุณกรอกจะหายไปทั้งหมด ยืนยันที่จะยกเลิกหรือไม่?',
          confirmText: 'ทิ้งข้อมูล',
          color: 'warn'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.registerForm.reset();
          this.router.navigate(['/login']);
        }
      });

    } else {
      // ถ้ายังไม่กรอกอะไรเลย ก็กลับได้เลย
      this.registerForm.reset();
      this.router.navigate(['/login']);
    }
  }
}