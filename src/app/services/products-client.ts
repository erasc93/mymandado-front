import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsState } from './products-state';
import { map, of, pipe, tap } from 'rxjs';
import { CartItem } from '@viewmodels/CartItem';
import { Product } from '@viewmodels/Product';

@Injectable()
export class ProductsClient {
  private _urlCart = 'mymandado/api/cart';
  private _urlProducts = 'mymandado/api/products';
  private _state = inject(ProductsState);
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
    // of<CartItem[]>([
    //   { id:3, quantity: 3,isdone:true ,product:{ id: 10, name:"fromage",unit: unit.pack }},
    // ])
    .pipe(
    )
    .subscribe(
      {
        next: cartitems => this._state.products.set(cartitems),
        // error: err => this._state.errorMessage.set(err),
        error: err => console.log(err),
        complete: () => { console.log(`get products is complete`);  this.isloading.set(false)}
      });
      
    }
    Delete(product: Product) {
      this._http.delete<Product>(`${this._urlProducts}/${product.id}`).subscribe({
        next: () => console.log("emited"),
        complete: () => this.RefreshValues(),
        error: error => {
          console.log(error);
          this.isloading.set(true);
          this.RefreshValues();
        }
      })
    } 
    
    public UpdateItem(item: CartItem): void{
      
      this._http.put<Product>(this._urlProducts, item.product).subscribe({
        next: () => console.log("emited"),
        complete: () => console.log(`${item} updated`),
        error: error => {
          console.log(error);
          this.isloading.set(true);
          this.RefreshValues();
        }
      })
      
      this._http.put<CartItem>(this._urlCart, item).subscribe({
        next: () => console.log("emited"),
        complete: () => console.log(`${item} updated`),
        error: error => {
          console.log(error);
          this.isloading.set(true);
          this.RefreshValues();
        }
      })
    }
  }