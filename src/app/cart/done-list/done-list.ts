import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState, TabView } from '@cart/AppState';
import { CartClient } from '@cart/cart-client';
import { CartItemsClient } from '@cart/cart-items-client';
import { StateMachine } from '@cart/cart-items-state';
import { FormAddCartItem, itemForm } from '@cart/form-add-cart-item/form-add-cart-item';
import { CartItem } from '@viewmodels/CartItem';
import { Product } from '@viewmodels/Product';
import { unit } from '@viewmodels/unit';
import { ProductsClient } from 'app/products/products-client';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { tap } from 'rxjs';

@Component({
  selector: 'mnd-done-list',
  providers:[CartItemsClient,CartClient], // used for updating product
  imports: [CheckboxModule,FormAddCartItem,CommonModule,FormsModule,ButtonModule,InputTextModule],
  templateUrl: './done-list.html',
  styleUrl: './done-list.scss',
})
export class DoneList implements OnInit{
  GoToView_Todo() {
    this._appState.tab.set(TabView.todos);
  }
  ngOnInit(): void {
    this._productsClient.FetchProducts()
    .pipe(tap((list:Product[]) => this._state.SetProducts(list)))
    .subscribe(this.ob)
  }
  private _productsClient = inject(ProductsClient);
  private _router :Router = inject(Router);
  protected _cartItemClient = inject(CartItemsClient);
  protected _cartClient = inject(CartClient);
  protected _state = inject(StateMachine);
  protected _appState = inject(AppState);
  
  public user = input<string>('');
  protected updatingItem= signal<itemForm>({namen:'',quantity:1,unity:unit.null})
  
  protected addFormVisible=signal( false);
  protected updateFormVisible=signal(false);
  private _oldName!: string;
  protected items = computed(() => this._state.cartItems().filter(x => x.isdone == true).sort((a,b)=>a.product.name.localeCompare(b.product.name)));
  
  
  protected delete(item: CartItem) {
    this._cartItemClient.RemoveItem(item).subscribe(this.ob);
  }
  
  protected showUpdateForm(item: CartItem) {
    const i: itemForm = {
      namen: item.product.name,
      quantity: item.quantity,
      unity: (item.product.unit==unit.null)?' ':item.product.unit
    };
    this.updatingItem.set({ ...i });
    this._oldName = item.product.name;
    this.updateFormVisible.set(true);
  }
  
  protected updateItemSubmit($event: itemForm): void {
    $event.namen;
    const item: CartItem = this._state.cartItems().filter(p => p.product.name == this._oldName)[0];
    
    item.product.name = $event.namen;
    item.product.unit = $event.unity;
    item.quantity = $event.quantity;
    
    this._cartItemClient.UpdateItem(item).subscribe(this.ob);
    this.updateFormVisible.set(false);
  }
  
  // protected toogle(checked: boolean,updated: CartItem, ) {
  //   updated.isdone=checked
  //   this._cartItemClient.UpdateItem(updated).pipe(tap(()=>this._state.UpdateItem(updated))).subscribe(this.ob)
  // }
  protected SetTodoStatus(item: CartItem,) {
    // item.isdone = false;
    const updated = { ...item, isdone: false };
    this._cartItemClient.UpdateItem(updated)
    .subscribe(this.ob)
  }
  private ob={error:(e:any)=>console.error(e)}
  
  
}
