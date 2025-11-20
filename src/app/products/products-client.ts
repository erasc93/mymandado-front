
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { item } from '@primeuix/themes/aura/breadcrumb';
import { Product } from '@viewmodels/Product';
import { StateMachine } from '@cart/cart-items-state';
import { Observable, tap } from 'rxjs';


@Injectable()
export class ProductsClient{
  
  private _urlProducts = 'mymandado/api/products';
  private _http = inject(HttpClient);
  private _state = inject(StateMachine);
  public isLoading = signal(false); 
  // --- --- ---
  public FetchProducts ():Observable<Product[]> {
    return this._http.get<Product[]>(this._urlProducts)
      .pipe(tap((list: Product[]) => this._state.SetProducts(list)));
  }
  public Update(product: Product):Observable<void> {
    return this._http.put<void>(this._urlProducts, product)
    .pipe( tap(()=>this._state.Update(product)))
  }
  public Delete(product: Product) :Observable<void>{
    return this._http.delete<void>(`${this._urlProducts}/${product.id}`)
      .pipe(tap(() => this._state.DeleteProduct(product)));
    
  }
  public AddProduct(product: Product) { 
    return this._http.post<Product>(this._urlProducts, product)
    .pipe(tap(p => this._state.AddProduct(p)
  ))
}
private RefreshState() {
  // refresh products state machine;
}
}


