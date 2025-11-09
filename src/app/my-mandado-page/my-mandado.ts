import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartItemsList } from '../cart/cart-items-list/cart-items-list';
import { unit } from 'app/viewmodels/unit';
import { CartItem } from 'app/viewmodels/CartItem';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { Button } from "primeng/button";
import { CartResolverData } from '@cart/cart-resolver';

@Component({
  selector: 'mnd-my-mandado',
  imports: [CommonModule, FormsModule, RouterModule,
    CartItemsList
   ],
  templateUrl: './my-mandado.html',
  styleUrl: './my-mandado.scss',
})

export class MyMandado implements OnInit{
  route = inject(ActivatedRoute)
  protected res_data$!: Observable<CartResolverData>;
  ngOnInit(): void {
    this.NavigateToCartItemsList();
  }
  private NavigateToCartItemsList() {
    this.res_data$ = this.route.data.pipe(
      map(data => data['cartitems']),
    );
  }
  
  
}
