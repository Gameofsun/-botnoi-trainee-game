import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DisplayUser } from '../models/user.model';
import { ThaiDatePipe } from '../pipes/thai-date.pipe';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, ThaiDatePipe],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon>account_circle</mat-icon>
        <span>ข้อมูลพนักงาน (Profile)</span>
      </div>
      <button mat-icon-button mat-dialog-close style="color: white;">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="custom-content">
      
      <div class="profile-hero">
        <img [src]="data.avatar || 'assets/images/default-avatar.png'" class="big-avatar">
        <div class="hero-text">
          <h2>{{ data.name }}</h2>
          <span class="role-pill" [style.background]="data.roleBadge">
            {{ data.roleText | titlecase }}
          </span>
        </div>
      </div>

      <hr class="divider">

      <div class="simple-list">

        <div class="list-item">
          <mat-icon>email</mat-icon>
          <div class="text-data">
            <label>อีเมล</label>
            <span>{{ data.email }}</span>
          </div>
        </div>

        <div class="list-item">
          <mat-icon>phone</mat-icon>
          <div class="text-data">
            <label>เบอร์โทรศัพท์</label>
            <span>{{ data.contact }}</span>
          </div>
        </div>

        <div class="list-item">
          <mat-icon>home</mat-icon>
          <div class="text-data">
            <label>ที่อยู่</label>
            <span>{{ data.address || '-' }}</span>
          </div>
        </div>

        <div class="list-item">
          <mat-icon>cake</mat-icon>
          <div class="text-data">
            <label>วันเกิด / อายุ</label>
            <span>{{ data.birthDate | thaiDate }} ({{ data.age }} ปี)</span>
          </div>
        </div>

        <div class="list-item">
          <mat-icon>business</mat-icon>
          <div class="text-data">
            <label>บริษัท / ตำแหน่ง</label>
            <span>{{ data.company || '-' }} - {{ data.jobTitle || '-' }}</span>
          </div>
        </div>

        <div class="list-item" *ngIf="data.university">
          <mat-icon>school</mat-icon>
          <div class="text-data">
            <label>มหาวิทยาลัย</label>
            <span>{{ data.university }}</span>
          </div>
        </div>

      </div>

    </mat-dialog-content>

    <mat-dialog-actions align="end" class="custom-actions">
      <button mat-stroked-button mat-dialog-close class="btn-close-theme">
        ปิดหน้าต่าง
      </button>
      <button mat-flat-button [mat-dialog-close]="true" class="btn-edit-theme">
        <mat-icon>edit</mat-icon> แก้ไขข้อมูล
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* Header Styles */
    .dialog-header {
      background: #2c7873; /* สีธีมหลัก */
      color: white; padding: 16px 20px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .header-content { display: flex; gap: 10px; align-items: center; font-size: 18px; }

    /* Hero Section (ย่อให้เล็กลงหน่อย) */
    .profile-hero {
      display: flex; align-items: center; gap: 16px; margin-bottom: 16px;
    }
    .big-avatar {
      width: 70px; height: 70px; border-radius: 50%; object-fit: cover;
      border: 3px solid #eee;
    }
    .hero-text h2 { margin: 0; font-size: 20px; color: #333; }
    .role-pill {
      padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;
      display: inline-block; color: #333; margin-top: 4px;
    }

    .divider { border: 0; border-top: 1px solid #eee; margin: 10px 0 20px 0; }
    .custom-content { padding-top: 20px !important; padding-bottom: 10px !important; }

    /* ✅ Styles ใหม่: รายการแบบเรียงลงมา */
    .simple-list {
      display: flex; flex-direction: column; gap: 16px;
    }
    .list-item {
      display: flex; align-items: flex-start; gap: 16px;
    }
    .list-item mat-icon {
      color: #2c7873; /* ไอคอนสีธีม */
      background: #eefcfb; /* พื้นหลังไอคอนจางๆ */
      padding: 8px;
      border-radius: 8px;
      width: 24px; height: 24px; /* ปรับขนาดให้พอดีกับ padding */
      box-sizing: content-box;
    }
    .text-data {
      display: flex; flex-direction: column;
    }
    .text-data label {
      font-size: 12px; color: #888; margin-bottom: 2px;
    }
    .text-data span {
      font-size: 15px; color: #333; font-weight: 500;
    }

    /* Action Buttons */
    .custom-actions { padding: 16px 24px !important; border-top: 1px solid #eee; gap: 8px; }
    .btn-close-theme { color: #2c7873 !important; border-color: #2c7873 !important; }
    .btn-edit-theme { background-color: #2c7873 !important; color: white !important; }
  `]
})
export class UserDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DisplayUser
  ) {}
}