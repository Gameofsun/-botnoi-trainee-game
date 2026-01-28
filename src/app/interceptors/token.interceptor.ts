import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  // 1. ดึง Token จาก Session หรือ Local Storage
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  // 2. ถ้ามี Token ให้ทำการ Clone Request เดิม แล้วแปะ Header เพิ่มเข้าไป
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // แปะป้ายบอกว่าฉันคือใคร
      }
    });
    // ส่ง Request ตัวใหม่ที่แปะป้ายแล้วออกไป
    return next(clonedReq);
  }

  // 3. ถ้าไม่มี Token ก็ปล่อยไปตามปกติ (เช่น ตอน Login)
  return next(req);
} 

// ลองใช้ api จริงๆ ใช้คนละเส้น list array ขั้นต่ำ 10-20 ตัว เอาข้อมูลที่สามารถ