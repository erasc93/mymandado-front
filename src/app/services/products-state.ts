import { Injectable, signal, WritableSignal } from '@angular/core';
import { CartItem } from '@viewmodels/CartItem';

@Injectable({
  providedIn: 'root'
})
export class ProductsState {
  public products:WritableSignal<CartItem[]>= signal<CartItem[]>([]);
  public errorMessage = signal('');
}
