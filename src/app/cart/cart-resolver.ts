import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of } from 'rxjs';
import { CartClient } from './cart-client';
import { Cart } from '@viewmodels/Cart';
import { Product } from '@viewmodels/Product';
import { ProductsClient } from 'app/products/products-client';

export const cartResolver: ResolveFn<CartResolverData> = (route, state) => {
  const cartClient = inject(CartClient);
  const productsClient = inject(ProductsClient);
  const username: string = route.paramMap.get('username')!;
  return forkJoin({
    carts: cartClient.FetchCarts(),
    products: productsClient.FetchProducts()
  })
    .pipe<CartResolverData>(map(res => (
    { username: username, carts: res.carts, products: res.products }
  )));
}

export interface CartResolverData{
  username: string;
  carts: Cart[];
  products:Product[];
}