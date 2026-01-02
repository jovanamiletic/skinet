
// export const routes: Routes = [
//   {path: '', component: HomeComponent}, // /
//   {path: 'shop', component: ShopComponent}, // /shop
//   {path: 'shop/:id', component: ProductDetailsComponent},// /shop/:id
//   {path:'cart', component: CartComponent},// /cart
//   {path:'checkout', component: CheckoutComponent, canActivate: [authGuard, emptyCartGuard]},// /checkout
//   { path: 'checkout/success', component: CheckoutSuccessComponent, canActivate: [authGuard, orderCompleteGuard] },
//   { path: 'orders', component: OrderComponent, canActivate: [authGuard] },
//   { path: 'orders/:id', component: OrderDetailedComponent, canActivate: [authGuard] },
//   {path:'account/login', component: LoginComponent},
//   {path:'account/register', component: RegisterComponent},
//   {path: 'test-error', component: TestErrorComponent},// /test-error DEBUG-ONLY ruta(ne ide u produkciju)
//   {path:'not-found', component:NotFoundComponent},// /not-found
//   {path:'server-error', component: ServerErrorComponent},// /server-error
//   {path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard]},
//   {path: '**', redirectTo: 'not-found', pathMatch: 'full'},// WILDCARD ruta (bilo koja ruta koja nije navedena gore bice preusmerena na not-found)
// ];
 

import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { TestErrorComponent } from './features/test-error/test-error.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { CartComponent } from './features/cart/cart.component';
import { authGuard } from './core/guards/auth-guard';
import { AdminComponent } from './features/admin/admin.component';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'shop/:id', component: ProductDetailsComponent },
    {
        path: 'orders',
        loadChildren: () => import('./features/orders/routes').then(mod => mod.orderRoutes)
    },
    {
        path: 'checkout',
        loadChildren: () => import('./features/checkout/routes').then(mod => mod.checkoutRoutes)
    },
    {
        path: 'account',
        loadChildren: () => import('./features/account/routes').then(mod => mod.accountRoutes)
    },
    { path: 'cart', component: CartComponent },
    { path: 'test-error', component: TestErrorComponent },
    { path: 'server-error', component: ServerErrorComponent },
    { path: 'admin', loadComponent: () => import('./features/admin/admin.component')
        .then(c => c.AdminComponent), canActivate: [authGuard, adminGuard] },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];
