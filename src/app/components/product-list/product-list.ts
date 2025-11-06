import { ChangeDetectorRef, Component, computed, ElementRef, inject, input, NgModule, NgZone, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Button, ButtonModule } from "primeng/button";
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { filter } from 'rxjs';
import { ProductsState } from '@services/products-state';
import { FormAddCartItem, itemForm } from '@components/form-add-cart-item/form-add-cart-item';
import { ProductsClient } from '@services/products-client';
import { Product } from '@viewmodels/Product';
import { unit } from '@models//unit';
import { CartItem } from '@viewmodels/CartItem';
import { CartResolverData } from '@services/cart-resolver';

@Component({
  selector: 'mnd-product-list',
  imports: [CommonModule, CheckboxModule, FormsModule, ButtonModule,  InputTextModule, FormAddCartItem],
  providers:[ProductsClient], // used for updating product
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  protected delete(product: Product) {
    this._cartClient.Delete(product);
  }
  user = input('');
  protected updatingItem= signal<itemForm>({namen:'',quantity:1,unity:unit.null})
  addItemSubmit($event: itemForm) :void{
    const item = this.BuildCartItem($event.namen, $event.quantity, $event.unity);
    this._cartClient.AddItem(item);
  }
  showUpdateForm(item: CartItem) {
    const i: itemForm = {
      namen: item.product.name,
      quantity: item.quantity,
      unity: (item.product.unit==unit.null)?' ':item.product.unit
    };
    this.updatingItem.set({ ...i });
    this.oldName = item.product.name;
    this.updateFormVisible=true;
  }
  private oldName!: string;
  
  updateItemSubmit($event: itemForm): void {
    $event.namen;
    const item: CartItem = this.productsState.products().filter(p => p.product.name == this.oldName)[0];
    
    item.product.name = $event.namen;
    item.product.unit = $event.unity;
    item.quantity = $event.quantity;
    
    this._cartClient.UpdateItem(item);
    this.productsState.products.set([...this.productsState.products()]);
    this.updateFormVisible=false;
  }
  protected formAddVisible= false;
  protected updateFormVisible = false;
  
  toogle(checked: boolean,updated: CartItem, ) {
    updated.isdone=checked
    this._cartClient.UpdateItem(updated);
    this.productsState.products.set([...this.productsState.products()]);
  }
  protected _cartClient = inject(ProductsClient);
  protected productsState = inject(ProductsState);
  protected loading = this._cartClient.isloading;
  protected doneonly = signal(false);
  protected products = computed(() => this.productsState.products().filter(x => x.isdone == this.doneonly()));
  
  public switchView() {
    this.doneonly.set(!this.doneonly());
  }
  private BuildCartItem(name: string, qtt: number, u: string): CartItem
  {
    const item :CartItem= 
    {
      id: -13,
      quantity: qtt,
      isdone: false,
      product: this.BuildProduct(name,u)
    }
    return item;
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
