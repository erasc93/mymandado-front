import { Component, inject,  OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'mnd-my-mandado',
  providers:[CartClient],
  imports: [CheckboxModule, CommonModule, FormsModule, ButtonModule, InputTextModule, RouterOutlet, RouterLinkWithHref],
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
  
}
