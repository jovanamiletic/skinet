import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  imports: [
    MatButton
  ],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss',
})
export class TestErrorComponent { // kako frontend hvata backend greske
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:5001/api/';
  validationErrors?: string[]; // čuva greške validacije (400)

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/notfound').subscribe({ //GET https://localhost:5001/api/buggy/notfound
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/internalerror').subscribe({ //GET https://localhost:5001/api/buggy/internalerror
      next: response => console.log(response),
      error: error => console.log(error)//
    });
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/unauthorized').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + 'buggy/validationerror', {}).subscribe({
      next: response => console.log(response),
      error: error => this.validationErrors = error
    });
  }
}
