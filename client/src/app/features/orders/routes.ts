import { Route } from "@angular/router";
import { OrderDetailedComponent } from "./order-detailed/order-detailed.component";
import { authGuard } from "../../core/guards/auth-guard";
import { OrderComponent } from "./order/order.component";

export const orderRoutes: Route[] = [
    {path: '', component: OrderComponent, canActivate: [authGuard]},
    {path: ':id', component: OrderDetailedComponent, canActivate: [authGuard]},
]