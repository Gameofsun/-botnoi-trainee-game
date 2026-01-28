import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThaiDatePipe } from '../pipes/thai-date.pipe';

export type MenuName = 'Dashboard' | 'Data API' | 'RxJS';

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

  select(menu: MenuName) {
    this.active = menu;
    this.menuSelected.emit(menu);
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    // อาจจะ emit หรือให้ main จัดการ route ต่อ
  }
}
