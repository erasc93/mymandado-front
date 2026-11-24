import { computed, Injectable, signal } from '@angular/core';
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
  public AddProduct(updatedProduct:Product) { this.#products.update((products:Product[])=>[...products,updatedProduct]); }
  public DeleteProduct(deletedProduct:Product) { this.#products.update((products:Product[])=>[...products.filter(p=>p.id!=deletedProduct.id)]); }
  public Update(updatedProduct: Product) { this.#products.update((products:Product[]) => [...products.filter(p => p.id != updatedProduct.id), updatedProduct]); }
  
  
  
  #carts= signal<Cart[]>([]);
  
  public readonly _carts = computed(()=>this.#carts().map<CartDisplay>(c => {
      return {
        id: c.id,
        userid: c.userid,
        numero: c.numero,
        name: c.name,
        description: c.description,
        count: c.items?.length ?? 0
      };
    })
  );
  public readonly selectedCart = signal<CartDisplay | null>(null);

  public cartItems = computed(() => {
    const selected = this.selectedCart();
    if (!selected) return [];
    const carts = this.#carts();
    const cart = carts.find(c => c.id === selected.id);
    
    if (!cart || !cart.items) return [];
    return [...cart.items].sort((a, b) => a.product.name.localeCompare(b.product.name));
  })

  public UpdateItem(item: CartItem)
  {
    this.updateSelectedCartItems((items: CartItem[]) => [
      ...items.filter(x => x.id != item.id),
      item
    ]);
  }
  
  
  public SetCarts(carts: Cart[]) {
    this.#carts.set([...carts]);
    this.syncSelectedCart();
  }
  public PushCart(carts: Cart) {
    this.#carts.set([...this.#carts(),carts]);
    this.syncSelectedCart();
  }
  public RemoveCart(cartId: number) {
    this.#carts.set(this.#carts().filter(cart => cart.id !== cartId));
    this.syncSelectedCart();
  }
  public SelectCartById(cartId: number) {
    const match = this._carts().find(c => c.id === cartId) ?? null;
    this.selectedCart.set(match);
  }
  public UpdateCartDetails(cartId: number, updates: Partial<Pick<Cart, 'name' | 'description'>>) {
    this.#carts.update(carts => carts.map(cart => cart.id === cartId
      ? { ...cart, ...updates }
      : { ...cart }
    ));
    this.syncSelectedCart();
  }

  public AddItem(item: CartItem)
  {
    this.updateSelectedCartItems((items: CartItem[]) => [...items, item]);
  }
  public RemoveItem(item: CartItem)
  {
    this.updateSelectedCartItems((items: CartItem[]) => items.filter(x => x.id != item.id));
  }
  
  
  
  public isloading= signal(false);

  private updateSelectedCartItems(updater: (items: CartItem[]) => CartItem[]): void {
    const selected = this.selectedCart();
    if (!selected) return;
    const cartId = selected.id;
    this.#carts.update(carts => carts.map((cart: Cart) => cart.id === cartId
      ? { ...cart, items: updater(cart.items ?? []) }
      : { ...cart }
    ));
    this.syncSelectedCart();
  }

  private syncSelectedCart(): void {
    const carts = this._carts();
    const current = this.selectedCart();

    if (carts.length === 0) {
      if (current !== null) this.selectedCart.set(null);
      return;
    }

    const match = current ? carts.find(c => c.id === current.id) : null;
    this.selectedCart.set(match ?? carts[0]);
  }
}

export interface CartDisplay{
  id: number;
  userid: number;
  numero: number;
  name: string;
  description: string;
  count: number;
}
