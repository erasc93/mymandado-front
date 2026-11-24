import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Cart } from "@viewmodels/Cart";
import { Observable, tap } from "rxjs";
import { StateMachine } from "./cart-items-state";
import { mndapi } from "app/constants/constants";

@Injectable()
export class CartClient {
   // private _urlCart = 'mymandado/api/cart';
   // private _urlCart = 'https://wa-cleeven-prj-azure.azurewebsites.net/api/cart';
   private _urlCart = `${mndapi}/cart`;
  private _http = inject(HttpClient);
  private _state= inject(StateMachine);
  public FetchCarts() :Observable<Cart[]>{
     return this._http.get<Cart[]>(this._urlCart)
     .pipe(tap(carts => this._state.SetCarts(carts)));
  }
  public AddNew(name:string, description?: string) :Observable<Cart>{
     return this._http.post<Cart>(this._urlCart, { name, description })
     .pipe(tap(cart => this._state.PushCart(cart)));
  } 
  public RemoveCart(cartId: number) {
     return this._http.delete<void>(this._urlCart + `/${cartId}`)
     .pipe(tap(() => this._state.RemoveCart(cartId)));
  }

  public ShareCart(cartId: number, username: string) :Observable<void> {
     return this._http.post<void>(`${this._urlCart}/${cartId}/share`, { username });
  }

  public RenameCart(cartId: number, name: string, description?: string): Observable<Cart> {
     return this._http.put<Cart>(`${this._urlCart}/${cartId}`, { name, description })
     .pipe(tap(cart => this._state.UpdateCartDetails(cartId, { name: cart.name, description: cart.description })));
  }
}
