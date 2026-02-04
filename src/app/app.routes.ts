import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main.component/main.component';
import { RegisterComponent } from './register/register.component';
import { SuccessComponent } from './success/success.component';
import { adminGuard } from './guards/admin.guard';
import { UserProfileComponent } from './main.component/user-profile.component';
import { ChatComponent } from './chat.component/chat.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'main', component: MainComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'user-/:id', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    
    component: MainComponent, 
    canActivate: [authGuard], 
    canActivateChild: [adminGuard], 
    children: [
   
      { path: 'game', component: MainComponent }, 
      { path: 'users', component: MainComponent }
    ]
  },

  { path: '**', redirectTo: 'login' },
];
