import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateMachine } from './cart-items-state';
import { CartItem } from 'app/viewmodels/CartItem';
import { Observable, tap } from 'rxjs';

@Injectable()
export class CartItemsClient {
  private _urlCartItems = 'mymandado/api/cartitems';
  private _http = inject(HttpClient);
  
  private _state = inject(StateMachine);
  
  public AddItem(item: CartItem) :Observable<CartItem>{
    return this._http.post<CartItem>(this._urlCartItems, item)
    .pipe( tap((it:CartItem)=>this._state.AddItem(it)))
  }
  public RemoveItem(item: CartItem) :Observable<void>{
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
