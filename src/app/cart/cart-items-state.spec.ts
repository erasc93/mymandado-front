import { StateMachine } from './cart-items-state';
import { Cart } from '../viewmodels/Cart';
import { CartItem } from '../viewmodels/CartItem';
import { Product } from '../viewmodels/Product';

const buildProduct = (id: number, name: string): Product => ({
  id,
  name,
  unit: 'kg'
});

const buildItem = (id: number, name: string, quantity = 1): CartItem => ({
  id,
  product: buildProduct(id, name),
  quantity,
  isdone: false
});

const buildCart = (numero: number, items: CartItem[]): Cart => ({
  id: numero,
  name: `cart-${numero}`,
  userid: 1,
  numero,
  description: '',
  items
});

describe('StateMachine', () => {
  it('starts with no selected cart and empty items', () => {
    const state = new StateMachine();

    expect(state.selectedCart()).toBeNull();
    expect(state.cartItems()).toEqual([]);
  });

  it('updates item in selected cart', () => {
    const state = new StateMachine();
    const item = buildItem(1, 'Apples');
    state.SetCarts([buildCart(1, [item])]);

    state.UpdateItem({ ...item, quantity: 3 });

    const items = state.cartItems();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(3);
  });

  it('removes item by id in selected cart', () => {
    const state = new StateMachine();
    const item1 = buildItem(1, 'Apples');
    const item2 = buildItem(2, 'Bananas');
    state.SetCarts([buildCart(1, [item1, item2])]);

    state.RemoveItem(item1);

    const items = state.cartItems();
    expect(items.length).toBe(1);
    expect(items[0].id).toBe(2);
    expect(state._carts()[0].count).toBe(1);
  });
});
