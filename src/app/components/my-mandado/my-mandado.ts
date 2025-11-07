import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductList } from '../product-list/product-list';
import { unit } from '@models//unit';
import { ProductsState } from '@services/products-state';
import { CartItem } from '@viewmodels/CartItem';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { CartResolverData } from '@services/cart-resolver';
import { Button } from "primeng/button";

@Component({
  selector: 'mnd-my-mandado',
  imports: [ProductList, CommonModule, FormsModule, RouterModule ],
  templateUrl: './my-mandado.html',
  styleUrl: './my-mandado.scss',
})

export class MyMandado implements OnInit{
  route = inject(ActivatedRoute)
  protected res_data$!: Observable<CartResolverData>;
  ngOnInit(): void {
    this.res_data$ = this.route.data.pipe(
      map(data => data['cartitems']),
    );
  }
  
  
}
