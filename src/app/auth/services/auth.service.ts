import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { RegisterResponse } from '../interfaces/register-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl:string = environment.baseUrl;
  private http = inject(HttpClient); //inyeccion de dependecias (otra forma de hacerlo, en vez de en el constructor)

  private readonly loginUrl:string = '/auth/login';
  private readonly registerUrl:string = '/auth/register';
  private readonly checkTokenUrl:string = '/auth/check-token';

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking); //por defecto el primer status de checking.

  //Necesito enviar info al mundo exterior, entonces para ello uso las public.
  public currentUser = computed( () => this._currentUser());
  public authStatus = computed( () => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user:User, token:string): boolean{
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login(email:string, password:string):Observable<boolean>{

    const url = `${this.baseUrl}${this.loginUrl}`;

    const body =  {email, password}; // realmente hay que enviarlo asi, { email: email, password: password}. pero como coinciden los nombres se puede simplificar

    return this.http.post<LoginResponse>(url, body)
            .pipe(
                map( ({user, token}) => this.setAuthentication(user,token)),

                //errores
                catchError( err => throwError( () => err.error.message ))
            );
  }

  register(email:string, name:string, password:string):Observable<boolean>{
    const url = `${this.baseUrl}${this.registerUrl}`;
    const body =  {email, name, password};

    return this.http.post<RegisterResponse>(url, body)
    .pipe(
        map( ({user, token}) => this.setAuthentication(user,token)),

        //errores
        catchError( err => throwError( () => err.error.message ))
    );
  }

  checkAuthStatus(): Observable<boolean>{
    const url   = `${this.baseUrl}${this.checkTokenUrl}`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set(
      'Authorization', `Bearer ${token}`
    );

    return this.http.get<CheckTokenResponse>(url, {headers:headers})
          .pipe(
            map( ({user, token}) => this.setAuthentication(user,token)),
            catchError(() => {
              this._authStatus.set(AuthStatus.notAuthenticated);
              return of(false);
            })
          );
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('url');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);

  }
}
