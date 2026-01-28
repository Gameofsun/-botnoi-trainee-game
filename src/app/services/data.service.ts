// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile, DisplayUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // 1. URL ของไฟล์เดิม (Local)
  private localDataUrl = 'assets/data/user-profiles.json';
  
  // 2. URL ของ API (DummyJSON)
  private apiUrl = 'https://dummyjson.com/users';

  constructor(private http: HttpClient) { }

  // =========================================================
  // 🟢 แบบที่ 1: ดึงข้อมูลจากไฟล์ JSON ในเครื่อง (ของเดิม)
  // =========================================================
  getLocalUsers(): Observable<DisplayUser[]> {
    return this.http.get<UserProfile[]>(this.localDataUrl).pipe(
      map((users, index) => users.map((user, i) => ({
        id: i + 1,
        name: user.fullName,
        roleText: user.role,
        roleBadge: this.getRoleColor(user.role),
        contact: user.phoneNumber || '-',
        email: user.email,
        emailLink: `mailto:${user.email}`,
        
        // ของเก่าไม่มีรูปและวันเกิด ให้ใส่ค่าว่างหรือ undefined ไว้
        avatar: 'assets/images/default-avatar.png', // หรือใส่รูป default ใน assets ก็ได้
        birthDate: undefined,
        age: undefined
      })))
    );
  }

  // =========================================================
  // 🔵 แบบที่ 2: ดึงข้อมูลจาก API จริง (ของใหม่)
  // =========================================================
  getApiUsers(): Observable<DisplayUser[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // API นี้ส่งข้อมูลมาใน key ชื่อ 'users'
        return response.users.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          roleText: user.role, 
          roleBadge: this.getRoleColor(user.role),
          contact: user.phone,
          email: user.email,
          emailLink: `mailto:${user.email}`,
          avatar: user.image,
          birthDate: user.birthDate,
          age: user.age,

          // ✨ 2. ข้อมูลเจาะลึก (ใหม่)
          username: user.username,
          gender: user.gender,
          
          // รวมที่อยู่เป็นก้อนเดียว
          address: `${user.address.address}, ${user.address.city}, ${user.address.state}`, 
          
          university: user.university,
          
          // ข้อมูลบริษัท
          company: user.company.name,
          jobTitle: user.company.title

        }));
      })
    );
  }

  getUserById(id: number): Observable<any> {
    // ยิงไปที่ https://dummyjson.com/users/1
    return this.http.get<any>(`${this.apiUrl}/${id}`);}
    
  // =========================================================
  // 🎨 Helper: ฟังก์ชันเลือกสี (ใช้ร่วมกัน)
  // =========================================================
  private getRoleColor(role: string): string {
    const r = role.toLowerCase();
    
    // สีแดง (Admin)
    if (r === 'admin') return '#fee2e2';     
    
    // สีเหลือง (Superuser / Moderator)
    if (r === 'superuser' || r === 'moderator') return '#fef3c7'; 
    
    // สีเขียว (User / Member)
    return '#d1fae5';                        
  }
}