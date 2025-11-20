import {  Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { StateMachine } from '@cart/cart-items-state';
import { FormAddCartItem, itemForm } from '@cart/form-add-cart-item/form-add-cart-item';
import { Product } from 'app/viewmodels/Product';
import { unit } from 'app/viewmodels/unit';
import { CartItem } from 'app/viewmodels/CartItem';
import { Router  } from '@angular/router';
import { CartItemsClient } from '@cart/cart-items-client';
import { CartClient } from '@cart/cart-client';
import { AppState, TabView } from '@cart/AppState';
import { ProductsClient } from 'app/products/products-client';
import { tap } from 'rxjs';
import { FormUpdateCartItem } from "@cart/form-update-cart-item/form-update-cart-item";


@Component({
  selector: 'mnd-todo-list',
  providers:[CartItemsClient,CartClient], // used for updating product
  imports: [CheckboxModule, FormAddCartItem, CommonModule, FormsModule, ButtonModule, InputTextModule, FormUpdateCartItem],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit{
  ngOnInit(): void {
    this._productsClient.FetchProducts()
      .pipe(tap((list:Product[]) => this._state.SetProducts(list)))
      .subscribe(this.ob)
  }
  protected addItemSubmit($event: itemForm) :void{
    const item = this.BuildCartItem($event.namen, $event.quantity, $event.unity);
    this._cartItemClient.AddItem(item).subscribe(this.ob);
  }
  private BuildCartItem(name: string, qtt: number, u: string): CartItem
  {
    const item :CartItem= 
    {
      id: -13,
      quantity: qtt,
      isdone: false,
      product: this.BuildProduct(name,u)
    }
    return item;
  }
  private BuildProduct(name: string, u: string): Product{
    
    const list = this._state.products();
    const product:Product = list.find(t=>t.name.toLowerCase().trim()===name.toLowerCase().trim())??
    {
      id: -13,
      name: name,
      unit: (u == unit.null)
      ? ' '
      : u
    }
    return product;
  }
  private _router :Router = inject(Router);
  protected _cartItemClient = inject(CartItemsClient);
  protected _cartClient = inject(CartClient);
  protected _productsClient = inject(ProductsClient);
  protected _state = inject(StateMachine);
  protected _appState = inject(AppState);
  
  public user = input<string>('');
  protected updatingItem= signal<itemForm>({namen:'',quantity:1,unity:unit.null})
  
  protected addFormVisible=signal(false);
  
  protected updateFormVisible =signal(false);
  private _oldName!: string;
  // protected doneonly = signal(false);
  protected items = computed(() => this._state.cartItems().filter(x => x.isdone == false));
  
  public GoToView_Done() {
    this._appState.tab.set(TabView.done);
  }
  protected logout() {
    this._state.SetCarts([]);
    this._router.navigateByUrl('');
  }
  protected delete(item: CartItem) {
    this._cartItemClient.RemoveItem(item).subscribe();
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
  
  protected SetItemDone(item: CartItem) {
    item.isdone = true;
    this._cartItemClient.UpdateItem(item).subscribe(this.ob)
  }
  private ob={
    error:(e:any)=>console.error(e)
  }
  
}
