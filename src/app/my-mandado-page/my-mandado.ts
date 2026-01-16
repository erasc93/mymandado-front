import { Component, inject, model, signal } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet, RouterLinkWithHref, NavigationEnd } from '@angular/router';
import { filter, map   } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CartDisplay, StateMachine } from '@cart/cart-items-state';
import { CartClient } from '@cart/cart-client';
import { CartItemsClient } from '@cart/cart-items-client';
import { CartRealtimeService } from '@cart/cart-realtime.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DrawerModule } from 'primeng/drawer';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { unit } from '@viewmodels/unit';
import type { CartEditForm } from '@cart/form-update-cart/form-update-cart';

@Component({
  selector: 'mnd-my-mandado',
  providers:[CartClient, CartItemsClient, CartRealtimeService],
  imports: [CheckboxModule, CommonModule, FormsModule, ButtonModule, InputTextModule, RouterOutlet,RouterLinkWithHref, 
    DrawerModule,ToolbarModule, MenuModule],
    templateUrl: './my-mandado.html',
    styleUrl: './my-mandado.scss',
  })
  
  export class MyMandado {
    private _route = inject(ActivatedRoute)
    private _router  = inject(Router);
    protected _state = inject(StateMachine);
    private _realtime = inject(CartRealtimeService);
    private _cartItemClient = inject(CartItemsClient);

    protected newCartName = model<string>('');
    protected cartEditVisible = signal(false);
    protected cartEditForm = signal<CartEditForm>({ name: '' });
    protected cartEditTargetId = signal<number | null>(null);
    protected cartMenuItems(cart: CartDisplay): MenuItem[] {
      return [
        {
          label: 'Renommer',
          icon: 'pi pi-pencil',
          command: () => this.openRenameForm(cart)
        }
      ];
    }
    

    protected cartTemplates: CartTemplate[] = [
      {
        name: 'Courses hebdo',
        items: [
          { name: 'lait', quantity: 1, unit: unit.l },
          { name: 'oeufs', quantity: 1, unit: unit.pack },
          { name: 'pain', quantity: 1, unit: unit.pack },
          { name: 'pates', quantity: 1, unit: unit.pack },
          { name: 'riz', quantity: 1, unit: unit.pack },
          { name: 'poulet', quantity: 1, unit: unit.kg },
          { name: 'tomates', quantity: 1, unit: unit.kg },
          { name: 'bananes', quantity: 1, unit: unit.kg }
        ]
      },
      {
        name: 'Petit dejeuner',
        items: [
          { name: 'cafe', quantity: 1, unit: unit.pack },
          { name: 'the', quantity: 1, unit: unit.pack },
          { name: 'sucre', quantity: 1, unit: unit.kg },
          { name: 'beurre', quantity: 1, unit: unit.pack },
          { name: 'confiture', quantity: 1, unit: unit.pack },
          { name: 'cereales', quantity: 1, unit: unit.pack }
        ]
      },
      {
        name: 'Entretien maison',
        items: [
          { name: 'lessive', quantity: 1, unit: unit.pack },
          { name: 'savon', quantity: 1, unit: unit.pack },
          { name: 'papier toilette', quantity: 1, unit: unit.pack },
          { name: 'liquide vaisselle', quantity: 1, unit: unit.pack },
          { name: 'eponges', quantity: 1, unit: unit.pack },
          { name: 'essuie-tout', quantity: 1, unit: unit.pack }
        ]
      }
    ];
    
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
      const name = this.newCartName().trim() || 'cart';
      this._cartClient.AddNew(name)
      .subscribe({
        next: cart => {
          this.newCartName.set('');
          this._state.SelectCartById(cart.id);
        },
        error: e => console.error(e)
      });
    }
    protected removeCart() {
      const selected = this._state.selectedCart();
      if (!selected) return;
      const message = `Supprimer le cart "${selected.name}" ?`;
      if (!confirm(message)) return;
      this._cartClient.RemoveCart(selected.id)
      .subscribe({ error: e => console.error(e) });
    } 

    protected shareVisible = signal(false);
    protected shareUsername = model<string>('');

    protected openShare() {
      this.shareUsername.set('');
      this.shareVisible.set(true);
    }
    protected cancelShare() {
      this.shareVisible.set(false);
    }
    protected submitShare() {
      const selected = this._state.selectedCart();
      const username = this.shareUsername().trim();
      if (!selected || !username) return;

      this._cartClient.ShareCart(selected.id, username)
        .subscribe({
          next: () => this.shareVisible.set(false),
          error: e => console.error(e)
        });
    }

    protected renameCart(cartId: number, name: string) {
      const trimmed = name.trim();
      if (!trimmed) return;
      const current = this._state._carts().find(cart => cart.id === cartId);
      if (current && current.name === trimmed) return;

      this._cartClient.RenameCart(cartId, trimmed)
        .subscribe({ error: e => console.error(e) });
    }

    protected submitCartEdit(update: CartEditForm): void {
      const cartId = this.cartEditTargetId();
      const trimmed = update.name.trim();
      if (cartId === null || !trimmed) return;
      this.renameCart(cartId, trimmed);
      this.cartEditTargetId.set(null);
      this.cartEditForm.set({ name: '' });
      this.cartEditVisible.set(false);
    }

    protected cancelCartEdit(): void {
      this.cartEditTargetId.set(null);
      this.cartEditForm.set({ name: '' });
      this.cartEditVisible.set(false);
    }

    private openRenameForm(cart: CartDisplay): void {
      this.shareVisible.set(false);
      this.cartEditForm.set({ name: cart.name });
      this.cartEditTargetId.set(cart.id);
      this.cartEditVisible.set(true);
    }
    
    selectCart(cart: CartDisplay) {
      this._state.SelectCartById(cart.id);
      this.cartEditVisible.set(false);
      this.shareVisible.set(false);
      console.log('selectCart', cart);
    } 
    
    protected sidebarVisible = false;
  }

type CartTemplateItem = {
  name: string;
  quantity: number;
  unit: string;
};

type CartTemplate = {
  name: string;
  items: CartTemplateItem[];
};
  
