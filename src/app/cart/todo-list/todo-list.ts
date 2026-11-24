import {  Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { StateMachine } from '@cart/cart-items-state';
import { FormAddCartItem, itemForm } from '@cart/form-add-cart-item/form-add-cart-item';
import { unit } from 'app/viewmodels/unit';
import { CartItem } from 'app/viewmodels/CartItem';
import {  RouterLink } from '@angular/router';
import { CartItemsClient } from '@cart/cart-items-client';
import { CartClient } from '@cart/cart-client';
import { FormUpdateCartItem } from "@cart/form-update-cart-item/form-update-cart-item";


@Component({
  selector: 'mnd-todo-list',
  providers:[CartItemsClient,CartClient], // used for updating product
  imports: [CheckboxModule, FormAddCartItem, CommonModule, FormsModule, ButtonModule, InputTextModule, FormUpdateCartItem ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  

  protected _cartItemClient = inject(CartItemsClient);
  protected _state = inject(StateMachine);

  protected filterMode = signal<'all' | 'done' | 'remaining'>('all');
  protected filteredItems = computed(() => {
    const items = [...this._state.cartItems()];
    const mode = this.filterMode();
    const byName = (a: CartItem, b: CartItem) =>
      a.product.name.localeCompare(b.product.name, undefined, { sensitivity: 'base' });

    if (mode === 'done') return items.filter(x => x.isdone).sort(byName);
    if (mode === 'remaining') return items.filter(x => !x.isdone).sort(byName);
    return items.sort((a, b) => {
      if (a.isdone !== b.isdone) return a.isdone ? 1 : -1;
      return byName(a, b);
    });
  });
  protected addFormVisible=signal(false);
  protected updatingItem= signal<itemForm>({namen:'',quantity:1,unity:unit.null})
  protected updateFormVisible =signal(false);
  
  private _nameHolder!: string;
  
  protected SubmitFormAdd($event: itemForm): void{
    const item = this._cartItemClient.BuildCartItem($event.namen, $event.quantity, $event.unity,false);
    this._cartItemClient.AddItem(item)
      .subscribe(this.ob);
  }

  protected ShowFormUpdate(item: CartItem) :void {
    const i: itemForm = {
      namen: item.product.name,
      quantity: item.quantity,
      unity: (item.product.unit==unit.null)?' ':item.product.unit
    };
    this.updatingItem.set({ ...i });
    this._nameHolder = item.product.name;
    this.updateFormVisible.set(true);
  }
  protected SubmitFormUpdate($event: itemForm): void {
    $event.namen;
    const
      item: CartItem = this._state.cartItems()
      .filter(p => p.product.name == this._nameHolder)[0];

    item.product.name = $event.namen;
    item.product.unit = $event.unity;
    item.quantity = $event.quantity;
    
    this._cartItemClient.UpdateItem(item).subscribe(this.ob);
    this.updateFormVisible.set(false);
  }
  
  private SetFilter(mode: 'all' | 'done' | 'remaining'): void {
    this.filterMode.set(mode);
  }
  protected SwitchFilter(): void{
    if (this.isFilter) {
      this.SetFilter('all');
      this.isFilter = false;
    }
    else {
      this.SetFilter('remaining');
      this.isFilter = true;
    }
  }
  protected isFilter = false;

  protected ToggleItemDone(item: CartItem) :void{
    item.isdone = !item.isdone;
    this._cartItemClient.UpdateItem(item).subscribe(this.ob)
  }
  private ob={
    error:(e:any)=>console.error(e)
  }
  
}
