import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CartClient } from './cart-client';
import { Cart } from '@viewmodels/Cart';
import { Product } from '@viewmodels/Product';
import { ProductsClient } from 'app/products/products-client';

export const cartResolver: ResolveFn<CartResolverData> = (route) => {
  const cartClient = inject(CartClient);
  const productsClient = inject(ProductsClient);
  
  const output =forkJoin({
    username:route.paramMap.get('username')!,
    carts: cartClient.FetchCarts(),
    products: productsClient.FetchProducts()
  });
  
  return output;
}

export interface CartResolverData{
  username: string;
  carts: Cart[];
  products:Product[];
}