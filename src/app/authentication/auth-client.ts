import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject,  Observable,  tap } from 'rxjs';
import { tokentype } from './tokentype';

@Injectable({providedIn:'root'})
export class AuthClient {
  _http = inject(HttpClient);
  private _loggedIn$ = new BehaviorSubject<boolean>(false);
  public readonly loggedIn$ = this._loggedIn$.asObservable();
  private readonly apiurl = 'mymandado/api/users';
  FetchUsernames(): Observable<string[]> {
    return this._http.get<string[]>(this.apiurl);
  }
  Authenticate(username: string , password: string|null) : Observable<tokentype>{
    const body = { username:username, password:password };
    return this._http.post<tokentype>(`${this.apiurl}/login`,body).pipe(
      tap(x => this.SetToken(x.token)),
      tap(token=>this._loggedIn$.next(true)),
    );
  }
  private SetToken(token: string) {
    sessionStorage.setItem('token', token);
  }
}

