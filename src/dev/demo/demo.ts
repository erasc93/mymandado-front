import { Component, inject } from '@angular/core';
import { StateMachine } from '@cart/cart-items-state';
import { Login } from 'app/authentication/login-page/login';
import { ImportFromList } from 'dev/import-from-list/import-from-list';

@Component({
  selector: 'mnd-demo',
  imports: [ImportFromList],
  templateUrl: './demo.html',
  styleUrl: './demo.scss',
})
export class Demo {
}
