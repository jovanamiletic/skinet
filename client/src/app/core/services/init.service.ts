import { inject, Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { CartService } from './cart.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(AccountService);

  init() {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return forkJoin({ //čekaj da se SVI requestovi završe, pa tek onda nastavi
      cart: cart$,
      user: this.accountService.getUserInfo()
    })
  }
}