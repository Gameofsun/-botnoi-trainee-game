import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',  // <--- ชื่อนี้ต้องตรงกับใน index.html
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html', // <--- ชื่อไฟล์นี้ ต้องตรงกับไฟล์ในข้อ 1 เป๊ะๆ
  styleUrls: ['./app.css']
})
export class AppComponent { }