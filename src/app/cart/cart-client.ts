import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Cart } from "@viewmodels/Cart";
import { map } from "rxjs";
import { StateMachine } from "./cart-items-state";
import { CartItem } from "@viewmodels/CartItem";

@Injectable()
export class CartClient { 
   private _urlCart = 'mymandado/api/cart';
   private _http = inject(HttpClient);
   private _state= inject(StateMachine);
   constructor() {
      this._state.cartnumber.set(0);
      this.FetchCarts();
   }
   public FetchCarts() {
      this._http.get<Cart[]>(this._urlCart)
      .subscribe({
         next: carts => this._state.SetCarts(carts), 
         error: err => console.error(err),
         complete: () => { console.info(`get products is complete`);  this._state.isloading.set(false)}
      });
   }
}
