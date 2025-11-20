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
  
  
  
  public cartnumber  = signal(0);
  #carts= signal<Cart[]>([]);
  // public cartItems = computed(() => {
  //   const carts = this.#carts();
  //   const numero = this.cartnumber();
  //   const cart = carts.find(c=>c.numero===numero);
  
  //   if (!cart || !cart.items) return [];
  //   return [...cart.items].sort((a, b) => a.product.name.localeCompare(b.product.name));
  // })
  
  
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
  //   public UpdateItem(item: CartItem) {
  //     this.#carts.update((carts:Cart[]) => {
  //       const numero = this.cartnumber();
  //       const caas:CartItem[]=[ ...carts.map(cart => {
  //         if (cart.numero !== numero) return cart;
  
  //         // On remplace l'item modifié par un nouvel objet
  //         const updatedItems = cart.items.map(i =>
  //           i.id === item.id ? { ...item } : i
  //         );
  
  //         return { ...cart, items: this.Sort(updatedItems) };
  //       })
  //     ]
  //     return caas;
  //   });
  // }
  // public UpdateItem(item: CartItem)
  // {
  //   this.#carts.update(carts => {
  //     const numero = this.cartnumber();
  //     const cartsvalue: Cart[] = carts.map((cart: Cart) => cart.numero === numero
  //     ? { ...cart, items: this.Sort([...cart.items.filter(t => t.id != item.id), item]) }
  //     : { ...cart });
  //     return [...cartsvalue];
  //   });
  // }
  
  public UpdateItem(item: CartItem)
  {
    this.cartItems.update((items: CartItem[]) => [...items.filter(x => x.product.id != item.product.id), item ]);
    // this.cartItems.update((items: CartItem[]) => [...this.Sort([...items.filter(x => x.product.id != item.product.id), item ])]);
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
