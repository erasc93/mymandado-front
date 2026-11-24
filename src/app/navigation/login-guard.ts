import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthClient } from '../authentication/auth-client';

export const loginGuard: CanActivateFn = () => {
  return inject(AuthClient).loggedIn$;
}
