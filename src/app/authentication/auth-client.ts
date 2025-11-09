import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, tap } from 'rxjs';
import { tokentype } from './tokentype';

@Injectable({providedIn:'root'})
export class AuthClient {
  _http = inject(HttpClient);
  private _loggedIn$ = new BehaviorSubject<boolean>(false);
  public readonly loggedIn$ = this._loggedIn$.asObservable();
  
  // private readonly apiurl = 'mymandado/api/users/login';
  private readonly apiurl = 'mymandado/api/users/login';
  Authenticate(username: string , password: string|null) : Observable<tokentype>{
    const body = { username:username, password:password };
    return this._http.post<tokentype>(`${this.apiurl}`,body)
      .pipe(
      tap(x => this.SetToken(x.token)),
      tap(isValid=>this._loggedIn$.next(true)),
    );
  }
  private SetToken(token: string) {
    sessionStorage.setItem('token', token);
  }
}

