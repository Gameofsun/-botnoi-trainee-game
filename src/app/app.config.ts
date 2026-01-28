import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

// ✅ 1. Import ของที่ต้องใช้ให้ครบ (เพิ่ม withInterceptors)
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// ✅ 2. Import ตัว Interceptor ที่เราสร้างไว้ (เช็ค path ให้ถูกนะ)
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideAnimations(),
    
    // ✅ 3. เรียกใช้แค่บรรทัดเดียว ใส่ interceptor เข้าไปข้างในเลย
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ],
};