import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject,  Observable,  tap } from 'rxjs';
import { tokentype } from './tokentype';
import { mndapi } from 'app/constants/constants';

@Injectable({providedIn:'root'})
export class AuthClient {
  private _http = inject(HttpClient);
  
  private _loggedIn$ = new BehaviorSubject<boolean>(false);
  public readonly loggedIn$:Observable<boolean> = this._loggedIn$.asObservable();
  public FetchUsernames(): Observable<string[]> {
    return this._http.get<string[]>(`${mndapi}/users`);
  }
  Authenticate(username: string , password: string|null) : Observable<tokentype>{
    const output: Observable<tokentype>
    = this._http.post<tokentype>(`${mndapi}/users/login`,  { username, password } )
    .pipe(
      tap((tokeninfo:tokentype) => sessionStorage.setItem('token', tokeninfo.token)),
      tap(()=>this._loggedIn$.next(true)),
    );
    
    return output;
  }
}

