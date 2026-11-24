import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StateMachine } from '@cart/cart-items-state';

@Component({
  selector: 'mnd-import-from-list',
  imports: [CommonModule],
  templateUrl: './import-from-list.html',
  styleUrl: './import-from-list.scss',
})
export class ImportFromList {
  protected _sm = inject(StateMachine);
}
