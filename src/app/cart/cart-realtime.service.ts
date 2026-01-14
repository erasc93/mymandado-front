import { DestroyRef, effect, inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { CartClient } from './cart-client';
import { StateMachine } from './cart-items-state';

interface CartChangeEvent {
  cartId: number;
  action: string;
  byUser: string;
}

@Injectable()
export class CartRealtimeService {
  private _state = inject(StateMachine);
  private _cartClient = inject(CartClient);
  private _destroyRef = inject(DestroyRef);
  private _connection: HubConnection;
  private _currentCartId: number | null = null;
  private _desiredCartId: number | null = null;
  private _syncing = false;
  private _pendingSync = false;

  constructor() {
    this._connection = new HubConnectionBuilder()
      .withUrl('mymandado/hubs/cart', {
        accessTokenFactory: () => sessionStorage.getItem('token') ?? ''
      })
      .withAutomaticReconnect()
      .build();

    this._connection.on('cartItemsChanged', (event: CartChangeEvent) => {
      const selected = this._state.selectedCart();
      if (!selected || selected.id !== event.cartId) return;
      this._cartClient.FetchCarts().subscribe({ error: e => console.error(e) });
    });

    this._connection.onreconnected(() => {
      void this.syncGroup();
    });

    this._connection.onclose(() => {
      this._currentCartId = null;
    });

    void this.start();

    effect(() => {
      const selected = this._state.selectedCart();
      this._desiredCartId = selected?.id ?? null;
      void this.syncGroup();
    });

    this._destroyRef.onDestroy(() => {
      void this._connection.stop();
    });
  }

  private async start(): Promise<void> {
    try {
      await this._connection.start();
      await this.syncGroup();
    } catch (error) {
      console.error(error);
    }
  }

  private async syncGroup(): Promise<void> {
    if (this._syncing) {
      this._pendingSync = true;
      return;
    }
    if (this._connection.state !== HubConnectionState.Connected) return;
    if (this._currentCartId === this._desiredCartId) return;

    this._syncing = true;
    try {
      if (this._currentCartId !== null) {
        await this._connection.invoke('LeaveCart', this._currentCartId);
      }
      if (this._desiredCartId !== null) {
        await this._connection.invoke('JoinCart', this._desiredCartId);
      }
      this._currentCartId = this._desiredCartId;
    } catch (error) {
      console.error(error);
    } finally {
      this._syncing = false;
      if (this._pendingSync) {
        this._pendingSync = false;
        await this.syncGroup();
      }
    }
  }
}
