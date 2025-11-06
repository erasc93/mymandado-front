import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, input, Output, output, signal, WritableSignal } from '@angular/core';
import { FormsModule, NgForm, NgModel, NgModelGroup } from '@angular/forms';
import { unit } from '@models//unit';
import { ProductsClient } from '@services/products-client';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {  InputGroupModule } from 'primeng/inputgroup';
import {  InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'mnd-form-add-cart-item',
  imports: [CommonModule, CheckboxModule,  ButtonModule, InputTextModule, SelectModule, InputNumberModule
    , InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, InputNumberModule,
    FormsModule 
  ],
  providers:[ProductsClient],
  templateUrl: './form-add-cart-item.html',
  styleUrl: './form-add-cart-item.scss',
})
export class FormAddCartItem {
  
  @Input() isvisible!: boolean;
  @Output() isvisibleChange = new EventEmitter<boolean>();
  
  public units:unit[]= Object.values(unit)
  
  // @Input('item_name')prdname!: string;
  // @Input('item_qtt')quantite!: number;
  // @Input('item_unit') selectedUnit :unit= unit.null;

  // @Input('item_name')prdname!: string;
  // protected quantity!: number;
  // @Input('item_unit') selectedUnit :unit= unit.null;
  

  // @Input() item: WritableSignal<itemForm> = signal<itemForm>({ namen:'', quantity:1, unity:unit.null });
  item = input<itemForm>({ namen:'', quantity:1, unity:unit.null });
  
  @Output() submit = new EventEmitter<itemForm>();
  cancel() {
    this.setVisibility(false);
  }
  protected setVisibility(vi: boolean): void{
    this.isvisible = vi;
    this.isvisibleChange.emit(this.isvisible);
  }
  
  onsubmit(form:NgForm) {
    
    const o :itemForm= { namen: form.value.name, quantity: form.value.quantity, unity: form.value.unit }
    this.submit.emit(o);;
    this.setVisibility(false);
  }
}

export interface itemForm{ namen: string; quantity: number; unity: string; }