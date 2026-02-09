import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  
  // 🔴 ต้องใส่เลข IP เครื่องคุณ (192.168.1.41) ห้ามใช้ localhost // ลองใช้ codeman
  private url = 'http://192.168.1.41:3000'; 

  constructor() {
    this.socket = io(this.url);
  }

  sendMessage(message: any) {
    this.socket.emit('chat-message', message);
  }

  getMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('chat-message', (data: any) => {
        observer.next(data);
      });
    });
  }
}