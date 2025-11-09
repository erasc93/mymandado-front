
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { item } from '@primeuix/themes/aura/breadcrumb';
import { Product } from '@viewmodels/Product';


@Injectable()
export class ProductsClient{
  
  private _urlProducts = 'mymandado/api/products';
  private _http = inject(HttpClient);
  public isLoading = signal(false); 
  public Update(product: Product): void{
    
    this._http.put<Product>(this._urlProducts, product).subscribe({
      next: () => console.log("emited"),
      complete: () => console.log(`${item} updated`),
      error: error => {
        console.log(error);
      }
    })
  }
  public Delete(product: Product) {
    this._http.delete<Product>(`${this._urlProducts}/${product.id}`)
    .subscribe({
      next: () => console.log("emited"),
      complete: () => this.RefreshState(),
      error: error => {
        console.log(error);
        this.isLoading.set(true);
        this.RefreshState();
      }
    })
  }
  private RefreshState() {
    // refresh products state machine;
  }
}


