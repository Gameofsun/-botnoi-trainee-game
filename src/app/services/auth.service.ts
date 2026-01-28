import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LoginCredential, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  private loginUrl = '/assets/data/login-users.json';
  private profileUrl = '/assets/data/user-profiles.json';

  constructor(private http: HttpClient) { }

 
  login(credential: LoginCredential): Observable<boolean> {
    return this.http.get<LoginCredential[]>(this.loginUrl).pipe(
      map(users => {
       
        const found = users.find(u => 
          u.username === credential.username && 
          u.password === credential.password
        );
        return !!found; 
      })
    );
  }


  getProfile(username: string): Observable<UserProfile | undefined> {
    return this.http.get<UserProfile[]>(this.profileUrl).pipe(
      map(profiles => profiles.find(p => p.username === username))
    );
  }
}