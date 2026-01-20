import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SuccessComponent } from './success/success.component';
import { DashboardComponent } from './job-application/job-application';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  // 1. เปลี่ยนให้เปิดมาเจอหน้า Register (กรอกใบสมัคร) ก่อน
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  
  
  // ลำดับหน้า: register -> login -> success
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'application', component: DashboardComponent},
  { path: 'profile', component: ProfileComponent }, 
];