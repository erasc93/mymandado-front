import { Routes } from '@angular/router';
import { MyMandado } from './components/my-mandado/my-mandado';
import { Notfound } from '@components/notfound/notfound';
import { Login } from '@components/login/login';
import { loginGuard } from '@services/login-guard';
import { cartResolver } from '@services/cart-resolver';

export const routes: Routes = [
   {path:'', redirectTo:'login', pathMatch:'full'},
   {
      path: 'mymandado/:username',
      loadComponent: () => import('@components/my-mandado/my-mandado')
         .then(m => m.MyMandado),
      canActivate:[loginGuard],
      resolve: { cartitems: cartResolver },
   },
   {
      path: 'login',
      loadComponent:()=>import('@components/login/login').then(m=>m.Login),
      children: [
      
         { path: '', component: Login },
   ]},
   {path:'**',component:Notfound}
];
