import { CommonModule } from '@angular/common';
import { Component, computed, inject,  linkedSignal,  OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateMachine } from '@cart/cart-items-state';
import { FormAddCartItem } from '@cart/form-add-cart-item/form-add-cart-item';
import { CartItem } from '@viewmodels/CartItem';
import { Product } from '@viewmodels/Product';
import { unit } from '@viewmodels/unit';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsClient } from '../products-client';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { FormProducts, prdForm } from "../form-products/form-products";

@Component({
  selector: 'mnd-products-list',
  imports: [CheckboxModule, CommonModule, FormsModule, ButtonModule, InputTextModule, FormAddCartItem, FormProducts],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList implements OnInit{
  selectedProduct=signal<Product|null >(null)
  formProduct = linkedSignal({
    source: this.selectedProduct,
    computation: () => {
      if (this.selectedProduct())
        return ({ namen: this.selectedProduct()!.name, unity: this.selectedProduct()!.unit });
      else return ({ namen: '', unity: '' });
    }
  });
  
  protected formAddVisible =signal( false);
  protected formUpdateVisible =signal( false);
  
  protected products = computed<Product[]>(() => this._state.products().sort((x,y)=>x.name.localeCompare(y.name)));
  protected _productsClient = inject(ProductsClient);
  protected _state = inject(StateMachine);
  
  ShowUpdateForm(product:Product) {
    this.formUpdateVisible.set(true);
    this.selectedProduct.set(product);
    // this.formProduct.set({ namen:product.name,unity:product.unit });
  }
  protected UpdateProductSubmit($event: prdForm) {
    this.selectedProduct.update((x) => ({...x!,name:$event.namen,unit:$event.unity}));
    
    if (this.selectedProduct()) {
      this._productsClient.Update(this.selectedProduct()!)
      .subscribe(this.ob);
    }
  }
  
  protected AddProductSubmit($event: prdForm) {
    const product = this.BuildProduct($event.namen, $event.unity);
    this._productsClient.AddProduct(product)
    .subscribe(this.ob)
  }
  protected DeleteProduct(product:Product) {
    this._productsClient.Delete(product).subscribe(this.ob);
  }
  ob={
    next: (x:any) => { console.log(x) },
    complete: () => {
      console.log("complete");
      this.selectedProduct.set(null);
    },
    error:(e:Error)=>console.error(e)
  }
  
  
  ngOnInit(): void {
    this._productsClient.FetchProducts();
  }
  
  
  private BuildProduct(name: string, u: string): Product{
    const prd: Product = {
      id: -13,
      name: name,
      unit: (u == unit.null)
      ? ' '
      : u
    }
    return prd;
  }
  
}
