import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, Address } from '../../shared/models/user';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  login(values: any) { //Pošalji login podatke backend-u i ako je sve OK, vrati mi ulogovanog korisnika i postavi cookie.
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values, { params}); //POST api/account/login?useCookies=true
  }
 
  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values);
  }

  //Angular: "Hej API, imam cookie, ko sam ja?"
  //API:     "Evo tvoj user objekat"  (ako je cookie validan)
  getUserInfo() { //jedini način da frontend zna da li je user ulogovan jeste da pita backend
    return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
        map(user => {
          this.currentUser.set(user);
          return user;
        })
      );
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {});
  }

   updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address).pipe(
      tap(() => {
        this.currentUser.update(user => {
          if (user) user.address = address;
          return user;
        })
      })
    )
  }

  getAuthState() {
    return this.http.get<{isAuthenticated: boolean}>(this.baseUrl + 'account/auth-status');
  }

}