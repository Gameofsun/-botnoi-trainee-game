import { Component, OnInit, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { SidebarComponent, MenuName } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { DisplayUser } from '../models/user.model';
import { ThaiDatePipe } from '../pipes/thai-date.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import moment from 'moment'; 

// Material Modules
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 

// ⚠️ เช็ค Path ให้ดีนะครับ ว่าไฟล์อยู่ที่ folder main.component จริงไหม
import { UserDetailDialogComponent } from '../main.component/user-detail-dialog.component'; 

export const MY_DASHBOARD_FORMATS = {
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
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    ThaiDatePipe,
    ReactiveFormsModule, 
    FormsModule,         
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,    
    MatTooltipModule,
    MatDatepickerModule, 
    MatFormFieldModule,  
    MatInputModule,      
    MatMomentDateModule,
    MatDialogModule, 
    MatSnackBarModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DASHBOARD_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } } 
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit { 
  activeMenu: MenuName = (sessionStorage.getItem('last_active_menu') as MenuName) || 'Dashboard';
  username: string = 'Guest';
  role: string = 'User';

  dataSource = new MatTableDataSource<DisplayUser>([]);
  displayedColumns: string[] = ['id', 'avatar', 'name', 'birthDate', 'age', 'role', 'email' ,'action'];
  isLoading = true;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (mp) this.dataSource.paginator = mp;
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    if (ms) this.dataSource.sort = ms;
  }

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar 
  ) {}

  // --- ในไฟล์ main.component.ts ---

ngOnInit(): void {
  this.username = sessionStorage.getItem('session_user') || 'Guest';
  this.role = sessionStorage.getItem('session_role') || 'User';

  this.loadData();

  this.range.valueChanges.subscribe(val => {
    if (val.start && val.end) {
      this.onDateRangeSelected(val.start, val.end);
    }
  });
}
  
  loadData() { 
    this.isLoading = true; 
    this.dataService.getApiUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        if (this.dataSource.paginator) {
           this.dataSource.paginator.firstPage();
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;

        this.snackBar.open('❌ เกิดข้อผิดพลาด! ไม่สามารถดึงข้อมูลจาก Server ได้', 'ลองใหม่', {
          duration: 5000,
          
          // ✅ ใส่ class 'center-snackbar' เพิ่มเข้าไป
          panelClass: ['error-snackbar', 'center-snackbar'], 
          
          // ✅ ต้องกำหนดเป็น top เพื่อให้ margin-top ใน CSS ทำงานอ้างอิงจากด้านบน
          verticalPosition: 'top',      
          horizontalPosition: 'center' 
        });
      }
    });
  }

  onMenuChange(menu: MenuName) { 
    this.activeMenu = menu; 
    
    // ✅ 2. เพิ่มส่วนนี้: บันทึกเมนูล่าสุดลง Session
    sessionStorage.setItem('last_active_menu', menu);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDateRangeSelected(start: any, end: any) {
    const startUTC = moment(start).utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    const endUTC = moment(end).utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss');

    console.log('--- Date Range Selected (UTC) ---');
    console.log('Start:', startUTC, '(+utc)');
    console.log('End:  ', endUTC, '(+utc)');
  }

  openEditDialog(row: DisplayUser) { 
    this.dialog.open(UserDetailDialogComponent, {
      width: '500px',
      data: row,             
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
      autoFocus: false
    });
  }
}