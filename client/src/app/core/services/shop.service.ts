import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/' //osnovni deo adrese backend API-ja
  private http = inject(HttpClient); // novi nacin Dependency Injection-a umesto klasicnog konstruktora 
  types: string[] = [];
  brands: string[] = [];//kesirani podaci-pamte se jednom ucitani Types i Brands

  getProduct(id: number){ 
    return this.http.get<Product>(this.baseUrl + 'products/' + id); // GET https://localhost:5001/api/products/12 
  }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();
    //filtriranje
    if (shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));// https://localhost:5001/api/products?brandsAngular,React
    }

    if (shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));// https://localhost:5001/api/products?types=boards
    }
    //sortiranje
    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort)// https://localhost:5001/api/products?sort=priceDesc  (value:name,priceAsc,priceDesc)
    }
    //pretraga(search)
    if (shopParams.search) {
      params = params.append('search', shopParams.search)// https://localhost:5001/api/products?search=pur
    }
    //pagination
    params = params.append('pageSize', shopParams.pageSize);// https://localhost:5001/api/products?pageSize=3

    params = params.append('pageIndex', shopParams.pageNumber);// https://localhost:5001/api/products?pageIndex=2

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', { params });
  }

  getBrands() {
    if (this.brands.length > 0) return; //ako su brandovi ucitani, ne zovi API ponovo
    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({ // obesrvable moze da vrati 3 vrste signala:next,err,complete
      next: response => this.brands = response, //response je tipa string[]
    })
  }

  getTypes() {
    if (this.types.length > 0) return;  
    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: response => this.types = response,
    })
  }

}
