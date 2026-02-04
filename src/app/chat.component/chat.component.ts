import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service'; 

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: any[] = []; 
  newMessage: string = '';
  currentUser = sessionStorage.getItem('session_fullname') || 'User';

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.chatService.getMessage().subscribe((data: any) => {
      if (data) {
        console.log('ได้รับข้อความจาก Socket:', data); // เช็ค Log ดูว่าเข้าไหม

        this.messages.push({
          text: data.text,
          sender: 'other', 
          time: new Date()
        });

        // 3. สั่งให้ Angular อัปเดตหน้าจอทันที!
        this.cdr.detectChanges(); 
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const msg = {
        text: this.newMessage,
        sender: 'me',
        time: new Date()
      };
      
      this.chatService.sendMessage(msg); 
      this.messages.push(msg);           
      this.newMessage = '';
      
    }
  }
}