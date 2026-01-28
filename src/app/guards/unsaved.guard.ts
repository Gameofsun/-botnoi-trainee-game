import { CanDeactivateFn } from '@angular/router';
import { RegisterComponent } from '../register/register.component';

// Guard นี้จะทำงานเฉพาะกับ RegisterComponent
export const unsavedGuard: CanDeactivateFn<RegisterComponent> = (component) => {
  
  // ✅ แก้ไขตรงเงื่อนไขนี้: เปลี่ยนจาก .submitted เป็น .isSubmitted
  if (component.registerForm.dirty && !component.isSubmitted) {
    return confirm('คุณมีข้อมูลที่ยังไม่ได้บันทึก ต้องการออกจากหน้านี้หรือไม่?');
  }
  
  return true;
  
};