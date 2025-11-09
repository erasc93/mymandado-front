import { Injectable, signal, WritableSignal } from '@angular/core';
import { CartItem } from 'app/viewmodels/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartItemsState {
  public products:WritableSignal<CartItem[]>= signal<CartItem[]>([]);
  public errorMessage = signal('');
}
