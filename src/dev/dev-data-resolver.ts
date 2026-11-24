import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { AuthClient } from 'app/authentication/auth-client';
import { tokentype } from 'app/authentication/tokentype';
import { catchError, EMPTY } from 'rxjs';

export const devDataResolver: ResolveFn<tokentype> = () => {

  const router = inject(Router);
  const username = 'visit',
    password = null;
  return inject(AuthClient).Authenticate(username, password).pipe(
    catchError((error) => {
      console.error('Erreur d\'authentification automatique:', error);
      router.navigate(['/login']);
      return EMPTY;
    })
  )
};
