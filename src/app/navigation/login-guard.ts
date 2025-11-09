import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthClient } from '../authentication/auth-client';
import { map } from 'rxjs';

export const loginGuard: CanActivateFn = (route, state) => {
  const auth=inject(AuthClient);
  return auth.loggedIn$.pipe(map(
    isLogged => { return isLogged }
  ));
}
