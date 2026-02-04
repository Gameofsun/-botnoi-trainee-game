import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThaiDatePipe } from '../pipes/thai-date.pipe';
import { Router } from '@angular/router';

// ✅ แก้ไข 1: ตรวจสอบว่ามี 'Chat' ในนี้ (ไม่ใช่ 'ChatSupport')
export type MenuName = 'Dashboard' | 'Data API' | 'RxJS' | 'Chat';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ThaiDatePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() active: MenuName = 'Dashboard';
  @Output() menuSelected = new EventEmitter<MenuName>();

  lastLogin = new Date();

  constructor(private router: Router) {}

  select(menu: MenuName) {
    this.active = menu;
    this.menuSelected.emit(menu);
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}