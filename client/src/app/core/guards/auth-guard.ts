import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { map, of } from 'rxjs';
//Guard proverava stanje PRE NEGO što se async login završi -> refresh resava stvar
//Route guard = UI kapija

//ne štiti podatke, samo sprečava navigaciju u UI-ju
export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.currentUser()) { // signal je synchronous funkcionalnost -> resenje je koristiti Observable(of(true))
    return of(true);
  } else {
    return accountService.getAuthState().pipe(
      map(auth => {
        if (auth.isAuthenticated) {a
          return true;
        } else {
          router.navigate(['/account/login'], {queryParams: {returnUrl: state.url}});
          return false;
        }
      })
    );
  }
};