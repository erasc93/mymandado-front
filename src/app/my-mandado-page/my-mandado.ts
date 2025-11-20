import { Component, inject,  OnInit, signal } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartItemsList } from '@cart/cart-items-list/cart-items-list';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { map, Observable  } from 'rxjs';
import { CartResolverData } from '@cart/cart-resolver';
import { TodoList } from "@cart/todo-list/todo-list";
import { ProductsList } from 'app/products/products-list/products-list';
import { CheckboxModule } from 'primeng/checkbox';
import { FormAddCartItem } from '@cart/form-add-cart-item/form-add-cart-item';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AppState, TabView } from '@cart/AppState';
import { DoneList } from "@cart/done-list/done-list";
import { StateMachine } from '@cart/cart-items-state';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'mnd-my-mandado',
  // imports: [CommonModule, FormsModule, RouterModule, CartItemsList, TodoList,ProductsList ],
  imports: [CheckboxModule, CommonModule, FormsModule, ButtonModule, InputTextModule, TodoList, ProductsList, DoneList, RouterOutlet],
  templateUrl: './my-mandado.html',
  styleUrl: './my-mandado.scss',
})

export class MyMandado implements OnInit{

  private _route = inject(ActivatedRoute)
  
  private _router  = inject(Router);
  protected _state = inject(StateMachine);
  protected res_data$!: Observable<CartResolverData>;
  protected _appState = inject(AppState);
  
  protected doneonly = signal(false);
  ngOnInit(): void {
    this.NavigateToCartItemsList();
    switch (this._appState.tab()) {
      case TabView.todos:
      break;
    }
  }
  private NavigateToCartItemsList() {
    this.res_data$ = this._route.data.pipe(
      map(data => data['cartitems']),
    );
  }
  protected logout() {
    this._state.SetCarts([]);
    this._router.navigateByUrl('');
  }
  public GoToView_Done() {
    this._appState.tab.set(TabView.done);
  }

  public GoToView_Todo() {
    this._appState.tab.set(TabView.todos);
  }
  GoToView_Products() {
    this._appState.tab.set(TabView.products);
  }
}
