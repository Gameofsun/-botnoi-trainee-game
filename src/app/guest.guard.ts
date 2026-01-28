import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  // เช็คทั้ง session/local เผื่อคุณเก็บแบบ remember
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  // ถ้าล็อกอินอยู่แล้ว -> ไม่ให้เข้า /login
  if (token) {
    return router.parseUrl('/main'); 
  }

  return true;
};
