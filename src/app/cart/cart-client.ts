import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Cart } from "@viewmodels/Cart";
import { map, Observable, tap } from "rxjs";
import { StateMachine } from "./cart-items-state";
import { CartItem } from "@viewmodels/CartItem";

@Injectable()
export class CartClient {
   private _urlCart = 'mymandado/api/cart';
   private _http = inject(HttpClient);
   private _state= inject(StateMachine);
   public FetchCarts() :Observable<Cart[]>{
      return this._http.get<Cart[]>(this._urlCart)
      .pipe(tap(carts => this._state.SetCarts(carts)));
   }
   public AddNew(name:string) :Observable<Cart>{
      return this._http.post<Cart>(this._urlCart+`/${this._state._carts().length}`,{name})
      .pipe(tap(cart => this._state.PushCart(cart)));
   } 
}
