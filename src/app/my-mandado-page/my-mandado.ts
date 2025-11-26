import { Component, computed, inject,  OnInit, signal } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet, RouterLinkWithHref, NavigationEnd } from '@angular/router';
import { filter, map, Observable  } from 'rxjs';
import { CartResolverData } from '@cart/cart-resolver';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StateMachine } from '@cart/cart-items-state';
import { CartClient } from '@cart/cart-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';
import { item } from '@primeuix/themes/aura/breadcrumb';

@Component({
  selector: 'mnd-my-mandado',
  providers:[CartClient],
  imports: [CheckboxModule, CommonModule, FormsModule, ButtonModule, InputTextModule, RouterOutlet,RouterLinkWithHref, 
    Menubar,DrawerModule,ToolbarModule,ListboxModule],
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
    addCart() {
      this._cartClient.AddNew("cart")
        .subscribe({ error: e => console.error(e) });
    } 
    // protected ixxx = [1, 2, 3];
    
    
    protected sidebarVisible = false;
  }
  