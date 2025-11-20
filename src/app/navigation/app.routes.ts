import { Routes } from '@angular/router';
import { MyMandado } from '../my-mandado-page/my-mandado';
import { Notfound } from 'app/navigation/notfound/notfound';
import { Login } from 'app/authentication/login-page/login';
import { loginGuard } from 'app/navigation/login-guard';
import { cartResolver } from '@cart/cart-resolver';
import { ProductsList } from 'app/products/products-list/products-list';
import { TodoList } from '@cart/todo-list/todo-list';
import { DoneList } from '@cart/done-list/done-list';

export const routes: Routes = [
   {path:'', redirectTo:'login', pathMatch:'full'},
   {
      path: 'mymandado/:username',
      loadComponent: () => import('app/my-mandado-page/my-mandado')
      .then(m => m.MyMandado),
      canActivate:[loginGuard],
      resolve: { cartitems: cartResolver },
      children: [

         {path:'',redirectTo:'todos',pathMatch:'full'},
         {path:'todos',component:TodoList,pathMatch:'full'},
         {path:'dones',component:DoneList,pathMatch:'full'},
         {path:'products',component:ProductsList,pathMatch:'full'}
      ]
   },
   {
      path: 'login',
      loadComponent:()=>import('app/authentication/login-page/login').then(m=>m.Login),
      children: [
         
         { path: '', component: Login , pathMatch:'full'},
      ]},
      {path:'**',component:Notfound}
   ];
   