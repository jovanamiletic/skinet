import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { TestErrorComponent } from './features/test-error/test-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const routes: Routes = [
  {path: '', component: HomeComponent}, // /
  {path: 'shop', component: ShopComponent}, // /shop
  {path: 'shop/:id', component: ProductDetailsComponent},// /shop/:id
  {path:'cart', component: CartComponent},// /cart
  {path:'checkout', component: CheckoutComponent},// /checkout
  {path: 'test-error', component: TestErrorComponent},// /test-error DEBUG-ONLY ruta(ne ide u produkciju)
  {path:'not-found', component:NotFoundComponent},// /not-found
  {path:'server-error', component: ServerErrorComponent},// /server-error
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'},// WILDCARD ruta (bilo koja ruta koja nije navedena gore bice preusmerena na not-found)
];
 