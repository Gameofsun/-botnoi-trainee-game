import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);
  
  // 1. ดึง Role จาก Session มาเช็ค
  const role = sessionStorage.getItem('session_role');

  // 2. เช็คว่าเป็น 'Admin' หรือไม่? (ต้องตรงกับใน JSON/Login)
  if (role && role.toLowerCase() === 'admin') {
    return true; // ✅ ผ่านได้
  }

  // 3. ถ้าไม่ใช่ Admin ให้ถีบออกไปหน้า Main หรือแจ้งเตือน
  alert('⛔️ Access Denied: สำหรับผู้ดูแลระบบเท่านั้น!');
  router.navigate(['/main']); 
  return false;
};