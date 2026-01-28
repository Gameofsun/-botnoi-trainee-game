import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// ✅ Import ให้ครบ
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';

import { FormsModule } from '@angular/forms'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container" *ngIf="userData; else loading">
      <div class="page-header">
        <h1>User Profile (ID: {{ userId }})</h1>
        <button mat-flat-button [color]="mode === 'edit' ? 'warn' : 'accent'" (click)="toggleMode()">
          {{ mode === 'edit' ? 'ยกเลิกแก้ไข' : 'แก้ไขข้อมูล' }}
        </button>
      </div>
      
      <mat-card class="profile-card">
         <div class="content">
            <div *ngIf="mode !== 'edit'">
               <h2>{{ userData.firstName }} {{ userData.lastName }}</h2>
               </div>
            
            <div *ngIf="mode === 'edit'">
               <mat-form-field><input matInput [(ngModel)]="userData.firstName"></mat-form-field>
               <button mat-raised-button (click)="saveData()">บันทึก</button>
            </div>
         </div>
      </mat-card>
      
      <button mat-stroked-button (click)="goBack()" *ngIf="mode !== 'edit'">กลับ</button>
    </div>
    <ng-template #loading>Loading...</ng-template>
  `,
  styles: [`.container { padding: 20px; }`] 
})
export class UserProfileComponent implements OnInit {
  userId: string | null = '';
  mode: string | null = ''; 
  userData: any = null;
  originalData: any = null; 

  // ✅ ระบุ Type ชัดเจนทุกตัว (แก้ Error unknown)
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private dataService: DataService = inject(DataService);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  constructor() {} 

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    // ✅ ใส่ (params: any) เพื่อแก้ Error Implicit any
    this.route.queryParams.subscribe((params: any) => {
      this.mode = params['mode'] || 'read';
    });

    if (this.userId) {
      this.dataService.getUserById(Number(this.userId)).subscribe({
        next: (data) => {
          this.userData = data;
          this.originalData = JSON.parse(JSON.stringify(data)); 
        },
        error: (err) => console.error(err)
      });
    }
  }

  toggleMode() {
    const targetMode = this.mode === 'edit' ? 'read' : 'edit';
    if (targetMode === 'read') {
      this.userData = JSON.parse(JSON.stringify(this.originalData));
    }
    this.mode = targetMode;
    // ใช้ตัวแปร router ที่เรา inject มา
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode: targetMode },
      queryParamsHandling: 'merge' 
    });
  }

  saveData() {
    this.originalData = JSON.parse(JSON.stringify(this.userData)); 
    this.snackBar.open('✅ บันทึกแล้ว', 'ปิด', { duration: 3000 });
    this.toggleMode();
  }

  goBack() {
    this.router.navigate(['/main']);
  }
}