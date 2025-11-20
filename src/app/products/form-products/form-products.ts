import { CommonModule } from '@angular/common';
import { Component, EventEmitter, model, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { unit } from '@viewmodels/unit';

@Component({
  selector: 'mnd-form-products',
  imports: [CommonModule, CheckboxModule,  ButtonModule, InputTextModule, SelectModule, InputNumberModule
    , InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, InputNumberModule,
    FormsModule 
  ],
  templateUrl: './form-products.html',
  styleUrl: './form-products.scss',
})
export class FormProducts {
Cancel() {
  this.item.set({ namen: '', unity: '' });
  this.isvisible.set(false);
}
  
  isvisible = model.required<boolean>();
  protected units:unit[]= Object.values(unit)
  
  item = model.required<prdForm>();
  
  @Output() OnSubmit = new EventEmitter<prdForm>();
  
  
  MySubmit(form:NgForm) {
    const unit=(form.value.unit =='.')?'':form.value.unit
    const o :prdForm= { namen: form.value.name,  unity: unit }
    this.OnSubmit.emit(o);
    this.isvisible.set(false);
  }
}

export interface prdForm{ namen: string;  unity: string; }