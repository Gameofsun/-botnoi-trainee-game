// user.model.ts

export type UserRole = 'Admin' | 'Member' | 'Superuser' | 'moderator' | 'user'; // เพิ่ม role ของ api ใหม่เผื่อไว้

export interface LoginCredential {
  username: string;
  password: string;
}

// ข้อมูลดิบ (ตรงกับไฟล์ user-profiles.json แบบเดิม)
export interface UserProfile {
  username: string; 
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
}

// ข้อมูลที่จะเอาไปโชว์บนหน้าเว็บ (Display)
export interface DisplayUser {
  id: number;
  name: string;
  roleText: string;
  roleBadge: string;
  contact: string;
  email: string;      
  emailLink: string;

  // ✅ เพิ่ม 3 ตัวนี้ และใส่ ? (Optional) เพื่อให้ใช้กับข้อมูลเก่าได้ไม่ error
  avatar?: string;    
  birthDate?: string;
  age?: number;
  username?: string;
  gender?: string;
  address?: string;    
  university?: string; 
  company?: string;    
  jobTitle?: string;
  
}