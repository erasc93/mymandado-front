import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItemsState } from './cart-items-state';
import { map, of, pipe, tap } from 'rxjs';
import { CartItem } from 'app/viewmodels/CartItem';
import { Product } from 'app/viewmodels/Product';
import { item } from '@primeuix/themes/aura/breadcrumb';

@Injectable()
export class CartItemsClient {
  private _urlCart = 'mymandado/api/cartitems';
  // private _urlProducts = 'mymandado/api/products';
  private _state = inject(CartItemsState);
  private _http = inject(HttpClient);
  
  public readonly isloading = signal(false);
  constructor() {
    if (this._state.products().length == 0) {
      this.RefreshValues(); 
    }
  }
  public AddItem(item: CartItem) {
    this._http.post<CartItem>(this._urlCart, item)
    .subscribe({
      next:()=>this.RefreshValues(),
      complete:()=>{},
      error:()=>{},
    })
  }
  
  public RefreshValues() {
    this._http.get<CartItem[]>(this._urlCart)
    .pipe(map(items=>items.sort((a,b)=>a.product.name.localeCompare(b.product.name)))
  )
  .subscribe(
    {
      next: cartitems => this._state.products.set(cartitems),
      // error: err => this._state.errorMessage.set(err),
      error: err => console.log(err),
      complete: () => { console.log(`get products is complete`);  this.isloading.set(false)}
    });
    
  }
  public Delete(item: CartItem) {
    this._http.delete(`${this._urlCart}/${item.id}`)
    .subscribe({
      next: () => console.log("emited"),
      complete: () => this.RefreshValues(),
      error: error => {
        console.log(error);
        this.isloading.set(true);
        this.RefreshValues();
      }
    })
  }
  
  public Update(cartItem: CartItem): void{
    this._http.put<CartItem>(this._urlCart, cartItem).subscribe({
      next: () => console.log("emited"),
      complete: () => console.log(`${cartItem} updated`),
      error: error => {
        console.log(error);
        this.isloading.set(true);
        this.RefreshValues();
      }
    })
  }
}
