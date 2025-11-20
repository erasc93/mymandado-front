import {  Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { StateMachine } from '@cart/cart-items-state';
import { FormAddCartItem, itemForm } from '@cart/form-add-cart-item/form-add-cart-item';
import { unit } from 'app/viewmodels/unit';
import { CartItem } from 'app/viewmodels/CartItem';
import { Router  } from '@angular/router';
import { CartItemsClient } from '@cart/cart-items-client';
import { CartClient } from '@cart/cart-client';
import { AppState, TabView } from '@cart/AppState';

@Component({
  selector: 'mnd-cart-items-list',
  imports: [CommonModule, CheckboxModule, FormsModule, ButtonModule, InputTextModule,
    FormAddCartItem],
    providers:[CartItemsClient,CartClient], // used for updating product
    templateUrl: './cart-items-list.html',
    styleUrl: './cart-items-list.scss',
  })
  export class CartItemsList {
    // private _router :Router = inject(Router);
    // protected _cartItemClient = inject(CartItemsClient);
    // protected _cartClient = inject(CartClient);
    // protected _state = inject(StateMachine);
    // protected _appState = inject(AppState);
    
    // public user = input<string>('');
    // protected updatingItem= signal<itemForm>({namen:'',quantity:1,unity:unit.null})
    
    // protected addFormVisible= false;
    // protected updateFormVisible = false;
    // private _oldName!: string;
    // // protected doneonly = signal(false);
    // protected items = computed(() => this._state.cartItems().filter(x => x.isdone == true));
    
    // // public switchViewDoneNotDone() {
    // //   this._appState.set(!this.doneonly());
    // // }
    // public GoToView_Done() {
    //   this._appState.tab.set(TabView.done);
    // }
    // public GoToView_Todos() {
    //   this._appState.tab.set(TabView.todos);
    // }
    // protected logout() {
    //   this._state.SetCarts([]);
    //   this._router.navigateByUrl('');
    // }
    // protected delete(item: CartItem) {
    //   this._cartItemClient.RemoveItem(item);
    // }
    
    // protected showUpdateForm(item: CartItem) {
    //   const i: itemForm = {
    //     namen: item.product.name,
    //     quantity: item.quantity,
    //     unity: (item.product.unit==unit.null)?' ':item.product.unit
    //   };
    //   this.updatingItem.set({ ...i });
    //   this._oldName = item.product.name;
    //   this.updateFormVisible=true;
    // }
    
    // protected updateItemSubmit($event: itemForm): void {
    //   $event.namen;
    //   const item: CartItem = this._state.cartItems().filter(p => p.product.name == this._oldName)[0];
      
    //   item.product.name = $event.namen;
    //   item.product.unit = $event.unity;
    //   item.quantity = $event.quantity;
      
    //   this._cartItemClient.Update(item);
    //   // this.productsState.cartItems.set([...this.productsState.cartItems()]);
    //   this.updateFormVisible=false;
    // }
    
    // protected toogle(checked: boolean,updated: CartItem, ) {
    //   updated.isdone=checked
    //   this._cartItemClient.Update(updated).subscribe({
    //     next:x=>this._cartClient.FetchCarts(),
    //     error:e=>console.error(e)
    //   })
    //   // this.productsState.cartItems.set([...this.productsState.cartItems()]);
    // }
    
    
    
  }
  