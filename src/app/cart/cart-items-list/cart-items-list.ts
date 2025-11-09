import {  Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { CartItemsState } from '@cart/cart-items-state';
import { FormAddCartItem, itemForm } from '@cart/form-add-cart-item/form-add-cart-item';
import { Product } from 'app/viewmodels/Product';
import { unit } from 'app/viewmodels/unit';
import { CartItem } from 'app/viewmodels/CartItem';
import { Router  } from '@angular/router';
import { CartItemsClient } from '@cart/cart-items-client';

@Component({
  selector: 'mnd-cart-items-list',
  imports: [CommonModule, CheckboxModule, FormsModule, ButtonModule, InputTextModule,
    FormAddCartItem],
    providers:[CartItemsClient], // used for updating product
    templateUrl: './cart-items-list.html',
    styleUrl: './cart-items-list.scss',
  })
  export class CartItemsList {
    private _router :Router = inject(Router);
    public user = input('');
    protected updatingItem= signal<itemForm>({namen:'',quantity:1,unity:unit.null})
    protected formAddVisible= false;
    protected updateFormVisible = false;
    private _oldName!: string;
    protected _cartItemClient = inject(CartItemsClient);
    protected productsState = inject(CartItemsState);
    protected loading = this._cartItemClient.isloading;
    protected doneonly = signal(false);
    protected products = computed(() => this.productsState.products().filter(x => x.isdone == this.doneonly()));

    public switchViewDoneNotDone() {
      this.doneonly.set(!this.doneonly());
    }
    protected logout() {
      this.productsState.products.set([]);
      this._router.navigateByUrl('');
    }
    protected delete(item: CartItem) {
      this._cartItemClient.Delete(item);
    }
    protected addItemSubmit($event: itemForm) :void{
      const item = this.BuildCartItem($event.namen, $event.quantity, $event.unity);
      this._cartItemClient.AddItem(item);
    }
    protected showUpdateForm(item: CartItem) {
      const i: itemForm = {
        namen: item.product.name,
        quantity: item.quantity,
        unity: (item.product.unit==unit.null)?' ':item.product.unit
      };
      this.updatingItem.set({ ...i });
      this._oldName = item.product.name;
      this.updateFormVisible=true;
    }
    
    protected updateItemSubmit($event: itemForm): void {
      $event.namen;
      const item: CartItem = this.productsState.products().filter(p => p.product.name == this._oldName)[0];
      
      item.product.name = $event.namen;
      item.product.unit = $event.unity;
      item.quantity = $event.quantity;
      
      this._cartItemClient.Update(item);
      this.productsState.products.set([...this.productsState.products()]);
      this.updateFormVisible=false;
    }
    
    
    protected toogle(checked: boolean,updated: CartItem, ) {
      updated.isdone=checked
      this._cartItemClient.Update(updated);
      this.productsState.products.set([...this.productsState.products()]);
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
  