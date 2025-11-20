import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateMachine } from './cart-items-state';
import { CartItem } from 'app/viewmodels/CartItem';
import { Observable, tap } from 'rxjs';
import { Product } from '@viewmodels/Product';
import { unit } from '@viewmodels/unit';

@Injectable()
export class CartItemsClient {
  // BuildCartItem(namen: string, quantity: number, unity: string) {
  //   throw new Error('Method not implemented.');
  // }
  public BuildCartItem(name: string, quantity: number, u: string, isdone: boolean): CartItem
  {
    const item :CartItem= 
    {
      id: -13,
      quantity,
      isdone,
      product: this.BuildProduct(name,u)
    }
    return item;
  }
  private BuildProduct(name: string, u: string): Product
  {
    const list = this._state.products();
    const product:Product = list.find(t=>t.name.toLowerCase().trim()===name.toLowerCase().trim())??
    {
      id: -13,
      name,
      unit: (u == unit.null)
      ? ' '
      : u
    }
    return product;
  }
  private _urlCartItems = 'mymandado/api/cartitems';
  private _http = inject(HttpClient);
  
  private _state = inject(StateMachine);
  
  public AddItem(item: CartItem) :Observable<CartItem>{
    return this._http.post<CartItem>(this._urlCartItems, item)
    .pipe( tap((it:CartItem)=>this._state.AddItem(it)))
  }
  public RemoveFrmListItem(item: CartItem) :Observable<void>{
    return this._http.delete<void>(`${this._urlCartItems}/${item.id}`)
    .pipe(tap(() => this._state.RemoveItem(item)));
  }
  public UpdateItem(item: CartItem): Observable<void>{
    return this._http.put<void>(this._urlCartItems + `/${this._state.cartnumber()}`, item)
    .pipe(
      tap(() => {
        this._state.UpdateItem({...item });
      }
    ));
  }
}
