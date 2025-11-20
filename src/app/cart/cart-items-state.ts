import { computed, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { Cart } from '@viewmodels/Cart';
import { Product } from '@viewmodels/Product';
import { CartItem } from 'app/viewmodels/CartItem';

@Injectable({
  providedIn: 'root'
})
export class StateMachine {
  
  #products= signal<Product[]>([]);
  public products= computed(()=>this.#products());
  
  public SetProducts(products:Product[]) { this.#products.set([...products]); }
  public AddProduct(product:Product) { this.#products.update(t=>[...t,product]); }
  public DeleteProduct(product:Product) { this.#products.update(t=>[...t.filter(p=>p.id!=product.id)]); }
  public Update(product: Product) { this.#products.update(t => [...t.filter(p => p.id != product.id), product]); }
  
  
  
  #carts= signal<Cart[]>([]);
  public cartnumber = linkedSignal({
    source: this.#carts,
    computation:()=>0,
  });
  
  public cartItems = linkedSignal({
    source:this.#carts,
    computation:()=>{
      const carts = this.#carts();
      const numero = this.cartnumber();
      const cart = carts.find(c=>c.numero===numero);
      
      if (!cart || !cart.items) return [];
      return [...cart.items].sort((a, b) => a.product.name.localeCompare(b.product.name));
    }
  })

  public UpdateItem(item: CartItem)
  {
    this.cartItems.update((items: CartItem[]) => [...items.filter(x => x.product.id != item.product.id), item ]);
  }
  
  
  public SetCarts(carts:Cart[]) { this.#carts.set([...carts]); }
  public mycars = computed(this.#carts);
  public AddItem(item: CartItem)
  {
    this.#carts.update(carts => {
      const numero = this.cartnumber();
      return carts.map((cart: Cart) => cart.numero === numero
      ? { ...cart, items: [...cart.items, item] }
      : { ...cart });
    });
  }
  public RemoveItem(item: CartItem)
  {
    this.cartItems.update((items: CartItem[]) => [...items.filter(x => x.product.id != item.product.id) ]);
    // this.cartItems.update((carts:CartItem[]) => {
    //   const numero = this.cartnumber();
    //   return carts.map((cart: Cart) => cart.numero === numero
    //   ? { ...cart, items: [...cart.items.filter(t => t.id != item.id)] }
    //   : { ...cart });
    // });
  }
  
  
  
  public isloading= signal(false);
  
  // private Sort(items: any[]) {
  //   return [...items].sort((a, b) => a.name.localeCompare(b.name));
  // }
}
