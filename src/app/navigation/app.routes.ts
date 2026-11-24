import { Routes } from '@angular/router';
import { Notfound } from 'app/navigation/notfound/notfound';
import { Login } from 'app/authentication/login-page/login';
import { loginGuard } from 'app/navigation/login-guard';
import { cartResolver } from '@cart/cart-resolver';
import { ProductsList } from 'app/products/products-list/products-list';
import { TodoList } from '@cart/todo-list/todo-list';
import { DoneList } from '@cart/done-list/done-list';
import { CartClient } from '@cart/cart-client';
import { ProductsClient } from 'app/products/products-client';
import { Demo } from 'dev/demo/demo';
import { devDataResolver } from 'dev/dev-data-resolver';

export const routes: Routes = [
   {
      path: '', redirectTo: 'dev/visit', pathMatch: 'full',
      // resolve:[devDataResolver]
   },
   // {path:'', redirectTo:'login', pathMatch:'full'},
   {
      path: 'dev/:username',
      loadComponent: () => import('dev/demo/demo').then(m => m.Demo),
      resolve: [devDataResolver],
      children: [
         {
            path: '', component: Demo, pathMatch: 'full',
            providers:[CartClient,ProductsClient],
            resolve: [cartResolver],
         },
      ]
   },
   {
      path: 'mymandado/:username',
      loadComponent: () => import('app/my-mandado-page/my-mandado')
      .then(m => m.MyMandado),
      providers:[CartClient,ProductsClient],
      canActivate:[loginGuard],
      resolve: { cartResolver },
      children: [
         
         {path:'',redirectTo:'todos',pathMatch:'full'},
         {path:'todos',component:TodoList,pathMatch:'full'},
         {path:'dones',component:DoneList,pathMatch:'full'},
         {path:'products',component:ProductsList,pathMatch:'full'}
      ]
   },
   {
      path: 'login',
      loadComponent: () => import('app/authentication/login-page/login')
      .then(m => m.Login),
      children: [
         
         { path: '', component: Login , pathMatch:'full'},
      ]},
      {path:'**',component:Notfound}
   ];
   