import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile, DisplayUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private localDataUrl = 'assets/data/user-profiles.json';
  private apiUrl = 'https://dummyjson.com/users';

  constructor(private http: HttpClient) { }

  // =========================================================
  // 🟢 1. Local Data & DummyJSON API 
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
        avatar: 'assets/images/default-avatar.png',
        birthDate: undefined,
        age: undefined
      })))
    );
  }

  getApiUsers(): Observable<DisplayUser[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
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
          username: user.username,
          gender: user.gender,
          address: `${user.address.address}, ${user.address.city}, ${user.address.state}`, 
          university: user.university,
          company: user.company.name,
          jobTitle: user.company.title
        }));
      })
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  private getRoleColor(role: string): string {
    const r = role.toLowerCase();
    if (r === 'admin') return '#fee2e2';     
    if (r === 'superuser' || r === 'moderator') return '#fef3c7'; 
    return '#d1fae5';                        
  }

  // =========================================================
  // 🌍 World Bank API 
  // =========================================================
  
  private loadJsonp(url: string): Observable<any> {
    return new Observable(observer => {
      const callbackName = 'wb_callback_' + Math.round(100000 * Math.random());
      
      const script = document.createElement('script');
      
      const separator = url.includes('?') ? '&' : '?';
      
      script.src = `${url}${separator}format=jsonp&prefix=${callbackName}`;
      script.async = true;

      (window as any)[callbackName] = (data: any) => {
        observer.next(data);
        observer.complete();
        cleanup();
      };

      script.onerror = (error) => {
        observer.error(error);
        cleanup();
      };

      const cleanup = () => {
        delete (window as any)[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };

      document.body.appendChild(script);
    });
  }

  getWorldBankCountries(): Observable<any[]> {
    const url = 'https://api.worldbank.org/v2/country?per_page=10';
    
    return this.loadJsonp(url).pipe(
      map(res => {
        if (res && res.length > 1) {
          return res[1];
        }
        return [];
      })
    );
  }

  getPopulationData(countryCode: string, startYear: number, endYear: number): Observable<any[]> {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?date=${startYear}:${endYear}`;
    
    return this.loadJsonp(url).pipe(
      map(res => {
        if (res && res.length > 1) {
          return res[1];
        }
        return [];
      })
    );
  }

  // =========================================================
  // 🌤️ Weather API (Open-Meteo) 
  // =========================================================
  getWeatherData(lat: number, lon: number, start: string, end: string): Observable<any> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min`;
    return this.http.get<any>(url);
  }
}