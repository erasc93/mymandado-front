import { CommonModule } from '@angular/common';
import { Component, computed, inject,  signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartClient } from '@cart/cart-client';
import { CartItemsClient } from '@cart/cart-items-client';
import { StateMachine } from '@cart/cart-items-state';
import { FormAddCartItem, itemForm } from '@cart/form-add-cart-item/form-add-cart-item';
import { CartItem } from '@viewmodels/CartItem';
import { unit } from '@viewmodels/unit';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'mnd-done-list',
  providers:[CartItemsClient,CartClient], // used for updating product
  imports: [CheckboxModule, FormAddCartItem, CommonModule, FormsModule, ButtonModule, InputTextModule, RouterLink],
  templateUrl: './done-list.html',
  styleUrl: './done-list.scss',
})
export class DoneList {
  
  protected _state = inject(StateMachine);
  protected _cartItemClient = inject(CartItemsClient);
  
  
  protected updatingItem= signal<itemForm>({namen:'',quantity:1,unity:unit.null})
  protected addFormVisible=signal(false);
  protected items = computed(() => this._state.cartItems()
    .filter(x => x.isdone == true)
    .sort((a, b) => a.product.name.localeCompare(b.product.name)));
  
  
  protected addItemSubmit($event: itemForm) :void{
    const item = this._cartItemClient.BuildCartItem($event.namen, $event.quantity, $event.unity,true);
    this._cartItemClient.AddItem(item).subscribe(this.ob);
  }
  protected RemoveFromList(item: CartItem):void { this._cartItemClient.RemoveFrmListItem(item).subscribe(this.ob); }
  protected SetTodoStatus(item: CartItem,) :void{
    const updated = { ...item, isdone: false };
    this._cartItemClient.UpdateItem(updated) .subscribe(this.ob)
  }
  private ob={error:(e:any)=>console.error(e)}
  
  
}
