import { Component,  inject,   signal } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet, RouterLinkWithHref, NavigationEnd } from '@angular/router';
import { filter, map   } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StateMachine } from '@cart/cart-items-state';
import { CartClient } from '@cart/cart-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { DrawerModule } from 'primeng/drawer';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'mnd-my-mandado',
  providers:[CartClient],
  imports: [CheckboxModule, CommonModule, FormsModule, ButtonModule, InputTextModule, RouterOutlet,RouterLinkWithHref, 
    DrawerModule,ToolbarModule,ListboxModule],
    templateUrl: './my-mandado.html',
    styleUrl: './my-mandado.scss',
  })
  
  export class MyMandado {
    private _route = inject(ActivatedRoute)
    private _router  = inject(Router);
    protected _state = inject(StateMachine);
    
    scurrentChild = signal<string>(''); // 'products' ou 'todo'
    
    currentChild=toSignal(this._router.events.pipe(
      filter(navEndOnly => navEndOnly instanceof NavigationEnd),
      map((path:NavigationEnd)=>this._route.firstChild?.snapshot.routeConfig?.path ?? '')
    ));
    
    
    protected logout() {
      this._state.SetCarts([]);
      this._router.navigateByUrl('');
    }
    
    _cartClient = inject(CartClient);
    protected addCart() {
      this._cartClient.AddNew("cart")
      .subscribe({ error: e => console.error(e) });
    }
    protected removeCart() {
      const numero = this._state.selectedCart().numero
      this._cartClient.RemoveCart( numero)
      .subscribe({ error: e => console.error(e) });
    } 
    
    selectCart(event:any) {
      console.log('selectCart', event);
    } 
    
    protected sidebarVisible = false;
  }
  