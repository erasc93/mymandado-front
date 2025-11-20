import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, input, model, Output, output, signal, WritableSignal } from '@angular/core';
import { FormsModule, NgForm, NgModel, NgModelGroup } from '@angular/forms';
import { unit } from 'app/viewmodels/unit';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {  InputGroupModule } from 'primeng/inputgroup';
import {  InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CartItemsClient } from '@cart/cart-items-client'

@Component({
  selector: 'mnd-form-add-cart-item',
  imports: [CommonModule, CheckboxModule,  ButtonModule, InputTextModule, SelectModule, InputNumberModule
    , InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, InputNumberModule,
    FormsModule 
  ],
  providers:[CartItemsClient],
  templateUrl: './form-add-cart-item.html',
  styleUrl: './form-add-cart-item.scss',
})
export class FormAddCartItem {
  
  public isvisible = model<boolean>();
  public item = input.required<itemForm>();
  @Output() public OnSubmit = new EventEmitter<itemForm>();
  
  
  protected allUnits:unit[]= Object.values(unit)
  protected CancelForm() :void{ this.isvisible.set(false); }
  public SubmitForm(form:NgForm) :void {
    const formValues: itemForm = {
      namen: form.value.name,
      quantity: form.value.quantity,
      unity: form.value.unit
    }
    this.OnSubmit.emit(formValues);
    this.isvisible.set(false);
  }
}

export interface itemForm{ namen: string; quantity: number; unity: string; }