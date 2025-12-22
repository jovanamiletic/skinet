import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { map } from 'rxjs';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.baseUrl; // api/
  private http = inject(HttpClient)
  cart = signal<Cart | null>(null); // signal ima trenutnu vrednost i listu "pretplatnika" (komponente koje ga koriste)
  
  itemCount = computed(() => { //azurira matBadge(broj proizvoda u korpi u header-u)
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0);
  });
  selectedDelivery = signal<DeliveryMethod | null>(null);
  
  totals = computed(()=> { //azurira cenu u checkout-u
    const cart = this.cart();
    const delivery = this.selectedDelivery();
    if (!cart) return null;
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = delivery ? delivery.price : 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount: 0, 
      total: subtotal + shipping - discount
    };
  });

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe( //pipe omogucava da uradim nesto sa Observable obj i i dalje vratim Observable
      map(cart => {
        // this.cart nije Cart, this.cart je signal koji DRŽI Cart
        // kad pozoves .set() -> vrednost se promeni, a Angular obavesti sve koji ga koriste -> UI se ponovo renderuje gde treba
        this.cart.set(cart); 
        return cart;
      })
    )
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({ // Angular salje POST /api/cart
      next: cart => this.cart.set(cart) //cart je ovde odgovor sa servera(nije isti objekat koji sam poslala)
    })
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {//quantity-koliko komada zelim da dodam
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;
    const index = cart.items.findIndex(i => i.productId === productId);
    if (index !== -1) {//imamo vec proizvod u korpi
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      } else {
        cart.items.splice(index, 1); //splice menja originalni niz(pocni od el sa prosledjenim indexom, i obrisi 1 el.pocevsi od tog)
      }
      if (cart.items.length === 0) {
        this.deleteCart();//brise element iz korpe u Redis-u
      } else {
        this.setCart(cart);//azurira korpu u Redis-u
      }
    }
  }

  deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      }
    });
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(i => i.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private mapProductToCartItem(product: Product): CartItem {
    return {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 0,
      pictureUrl: product.pictureUrl,
      brand: product.brand,
      type: product.type
    };
  }

  //union - item: CartItem | Product
  //type guard - funkcija čiji povratni tip ima oblik: paramName is SomeType
  private isProduct(item: CartItem | Product): item is Product { // item is Product (type guard - ako ova f-ja vrati true, TS zakljucuje da je item tipa Product)
    return (item as Product).id !== undefined;
  }

  private createCart() : Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }
}