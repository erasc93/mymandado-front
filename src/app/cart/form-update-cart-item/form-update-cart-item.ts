import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CartItemsClient } from '@cart/cart-items-client';
import { itemForm } from '@cart/form-add-cart-item/form-add-cart-item';
import { unit } from '@viewmodels/unit';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'mnd-form-update-cart-item',
  imports: [CommonModule, CheckboxModule,  ButtonModule, InputTextModule, SelectModule, InputNumberModule
    , InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, InputNumberModule,
    FormsModule 
  ],
  providers:[CartItemsClient],
  templateUrl: './form-update-cart-item.html',
  styleUrl: './form-update-cart-item.scss',
})
export class FormUpdateCartItem {
  
  isvisible = model<boolean>();
  protected units:unit[]= Object.values(unit)
  
  item = input.required<itemForm>();
  // item = input<itemForm>({ namen:'', quantity:1, unity:unit.null });
  
  @Output() OnSubmit = new EventEmitter<itemForm>();
  cancel() {
    this.setVisibility(false);
  }

  protected setVisibility(vi: boolean): void{
    this.isvisible.set(vi);
  }
  
  MySubmit(form:NgForm) {
    const o :itemForm= { namen: form.value.name, quantity: form.value.quantity, unity: form.value.unit }
    this.OnSubmit.emit(o);
    this.setVisibility(false);
  }
}