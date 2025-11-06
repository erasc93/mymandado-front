import { waitForAsync } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { delay, map, of, tap } from 'rxjs';

export const cartResolver: ResolveFn<CartResolverData> = (route, state) => {
  
  let username = route.paramMap.get('username');
  if (!username) { username = 'visitor'; }
  return of({ username })
    // .pipe(delay(1000));
};

export interface CartResolverData{
  username: string;
}