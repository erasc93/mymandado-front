import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'mnd-form-update-cart',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './form-update-cart.html',
  styleUrl: './form-update-cart.scss',
})
export class FormUpdateCart {
  isvisible = model.required<boolean>();
  item = input.required<CartEditForm>();

  @Output() OnSubmit = new EventEmitter<CartEditForm>();

  protected Cancel(): void {
    this.isvisible.set(false);
  }

  protected SubmitForm(form: NgForm): void {
    const name = (form.value.name ?? '').trim();
    if (!name) return;
    this.OnSubmit.emit({ name });
    this.isvisible.set(false);
  }
}

export interface CartEditForm {
  name: string;
}
