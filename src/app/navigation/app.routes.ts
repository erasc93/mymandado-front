import { Routes } from '@angular/router';
import { MyMandado } from '../my-mandado-page/my-mandado';
import { Notfound } from 'app/navigation/notfound/notfound';
import { Login } from 'app/authentication/login-page/login';
import { loginGuard } from 'app/navigation/login-guard';
import { cartResolver } from '@cart/cart-resolver';

export const routes: Routes = [
   {path:'', redirectTo:'login', pathMatch:'full'},
   {
      path: 'mymandado/:username',
      loadComponent: () => import('app/my-mandado-page/my-mandado')
         .then(m => m.MyMandado),
      canActivate:[loginGuard],
      resolve: { cartitems: cartResolver },
   },
   {
      path: 'login',
      loadComponent:()=>import('app/authentication/login-page/login').then(m=>m.Login),
      children: [
      
         { path: '', component: Login },
   ]},
   {path:'**',component:Notfound}
];
