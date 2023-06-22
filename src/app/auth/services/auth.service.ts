import { RegisterResponse } from './../interfaces/register-response.interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,  computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of,  throwError } from 'rxjs';
import { environments } from 'src/environments/environments';
import { CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { AuthStatus } from '../enumeration';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environments.baseUrl;
  private http = inject( HttpClient );

  private _currentUser = signal<User|null>(null);
  private _authStatus  = signal<AuthStatus>(AuthStatus.checking);  

  // !Al Mundo exterior
  public currentUser = computed<User|null>(() => this._currentUser());
  public authStatus  = computed<AuthStatus>(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
   }

  private serAuthetication(user:User, token:string): boolean{
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authnticated);
    localStorage.setItem('token', token);
    return true;
  }

  login(email:string, password:string): Observable<boolean> {

    const url =`${this.baseUrl}/auth/login`;
    const body = {email, password};

    return  this.http.post<LoginResponse>(url, body)
                    .pipe(
                      map(({user, token}) => this.serAuthetication(user, token)),
                      catchError(err =>  throwError(() => err.error.message ))
                    )
  }

  register(email:string, password:string, name: string): Observable<boolean>{
    const url =`${this.baseUrl}/auth/register`;
    const body = {email, password, name};
    return  this.http.post<RegisterResponse>(url, body)
    .pipe(
      map(({user, token}) => this.serAuthetication(user, token)),
      catchError(err =>  throwError(() => err.error.message ))
    )
  }

  checkAuthStatus(): Observable<boolean> {
    const url   =`${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if( !token ){
      this.logout(); 
     return of( false )
    };
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return this.http.get<CheckTokenResponse>(url,{headers})
                    .pipe(
                      map(({token, user}) => this.serAuthetication(user, token)),
                      catchError(() => {
                      this._authStatus.set(AuthStatus.notAuthticated);
                       return of(false)
                      })
                    );
  }

  logout(){
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthticated);
  }
}