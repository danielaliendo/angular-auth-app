import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthStatus, LoginResponse, User, VerifyTokenResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient)

  private _currentUser = signal<User | null>(null)
  private _authStatus = signal<AuthStatus>(AuthStatus.checking)

  public currentUser = computed(() => this._currentUser())
  public authStatus = computed(() => this._authStatus())

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  public login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(({ token, ...user }) => this.setAuthentication(token, user)),
        catchError(({ error }) => {
          console.log(error);
          return throwError(() => error.message);
        })
      )
  }

  public checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/verify-token`;
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<VerifyTokenResponse>(url, { headers })
      .pipe(
        map(({ token, ...user }) => this.setAuthentication(token, user)),
        catchError(() => {
          sessionStorage.removeItem('token');
          this._currentUser.set(null);
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false)
        })
      )
  }

  private setAuthentication(token: string, user: User):boolean {

    if (!token || !user) return false;

    sessionStorage.setItem('token', token);
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);

    return true
  }

  public logout(): void {
    sessionStorage.removeItem('token');
    localStorage.removeItem('redirectUrl');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

}
