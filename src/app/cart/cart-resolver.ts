import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';

export const cartResolver: ResolveFn<CartResolverData> = (route, state) => {
  
  let username = route.paramMap.get('username');
  if (!username) { username = 'visitor'; }
  return of({ username })
};

export interface CartResolverData{
  username: string;
}