import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  baseUrl = 'https://localhost:5001/api/' //osnovni deo adrese backend API-ja
  private http = inject(HttpClient); // novi nacin Dependency Injection-a umesto klasicnog konstruktora
  title = 'Skinet';
  products: Product[] = []; // niz proizvoda koje ces dobiti sa API-ja

  ngOnInit(): void { // lifecycle hook koji Angular poziva jednom
    this.http.get<Pagination<Product>>(this.baseUrl + 'products').subscribe({
      next: response => this.products = response.data, // next se poziva svaki put kad stigne uspesan odgovor(response je ceo JSON koji server vrati)
      error: error => console.log(error),
      complete: () => console.log('complete')//complete se poziva kad Observable zavrsi svoj rad (ugl. kad HTTP zahtev dobije odg i zatvori se; kod HTTP zahteva - desava se jednom po pozivu)
    })
  }
}
