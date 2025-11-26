import { CommonModule } from '@angular/common';
import { Component, computed, inject,  linkedSignal,  OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateMachine } from '@cart/cart-items-state';
import { Product } from '@viewmodels/Product';
import { unit } from '@viewmodels/unit';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsClient } from '../products-client';
import { FormProducts, prdForm } from "../form-products/form-products";

@Component({
  selector: 'mnd-products-list',
  imports: [CheckboxModule, CommonModule, FormsModule, ButtonModule, InputTextModule,  FormProducts],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList implements OnInit{
  
  ngOnInit(): void {
    this.Refresh()
  }
  private _productsClient = inject(ProductsClient);
  private _state = inject(StateMachine);
  
  private _selectedProduct=signal<Product|null >(null)
  protected products = computed<Product[]>(() => this._state.products().sort((x,y)=>x.name.localeCompare(y.name)));
  
  protected formAddVisible =signal( false);
  protected formUpdateVisible = signal(false);
  protected formProduct = linkedSignal({
    source: this._selectedProduct,
    computation: () => {
      if (this._selectedProduct())
        return ({ namen: this._selectedProduct()!.name, unity: this._selectedProduct()!.unit });
      else return ({ namen: '', unity: '' });
    }
  });
  
  protected ShowFormUpdate(product:Product) :void{
    this.formUpdateVisible.set(true);
    this._selectedProduct.set(product);
  }
  protected UpdateProductSubmit($event: prdForm):void {
    this._selectedProduct.update((x) => ({...x!,name:$event.namen,unit:$event.unity}));
    
    if (this._selectedProduct()) {
      this._productsClient.Update(this._selectedProduct()!)
      .subscribe(this._observer);
    }
  }
  protected AddProductSubmit($event: prdForm) {
    const product = this.BuildProduct($event.namen, $event.unity);
    this._productsClient.AddProduct(product)
    .subscribe(this._observer)
  }
  protected DeleteProductSubmit(product:Product) {
    this._productsClient.Delete(product).subscribe(this._observer);
  }
  Refresh() {
    
    this._productsClient.FetchProducts().subscribe();
  }
  
  // --- --- ---
  private _observer = {
    next: (x: any) => { console.log(x) },
    complete: () => {
      console.log("complete");
      this._selectedProduct.set(null);
    },
    error: (e: Error) => console.error(e)
  };
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
