import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { AuthStatus, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl:string = environment.baseUrl;
  private http = inject(HttpClient); //inyeccion de dependecias (otra forma de hacerlo, en vez de en el constructor)

  private readonly loginUrl:string = '/auth/login';

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking); //por defecto el primer status de checking.

  //Necesito enviar info al mundo exterior, entonces para ello uso las public.
  public currentUser = computed( () => this._currentUser());
  public authStatus = computed( () => this._authStatus());

  constructor() { }


  login(email:string, password:string):Observable<boolean>{

    const url = `${this.baseUrl}${this.loginUrl}`;

    const body =  {email, password}; // realmente hay que enviarlo asi, { email: email, password: password}. pero como coinciden los nombres se puede simplificar

    return this.http.post<LoginResponse>(url, body)
            .pipe(
                tap( ({user, token}) => {
                    this._currentUser.set(user);
                    this._authStatus.set(AuthStatus.authenticated);
                    localStorage.setItem('token', token);
                    console.log({user,token});
                }),
                map(() => true),

                //errores
                catchError( err => throwError( () => err.error.message ))
            );
  }
}
