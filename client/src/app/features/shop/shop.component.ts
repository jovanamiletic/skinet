import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule //ngModel
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>; //na početku može biti undefined (dok se API ne vrati) - STATE(koji proizvodi su trenutno prikazani)
  sortOptions = [
    { name: 'Alphabetical', value: 'name' }, // value se salje backend-u kao query parametar sort
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' },
  ];
  shopParams = new ShopParams(); // STATE (trenutni filteri,sort,search,page)
  pageSizeOptions = [5, 10, 15, 20];
  pageEvent?: PageEvent; // STATE(trenutna paginacija)

  ngOnInit() { //poziva se jednom -> kada se komponenta kreira. Idealno mesto da “napuniš ekran”.
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.getProducts();
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1; //resetuješ stranu na 1 (logično: nova pretraga počinje od prve strane)
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response,
      error: error => console.error(error)
    })
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({ //servis vraca Observable, a odavde se subscribe-ujes(DOBAR PATTERN)
      next: response => this.products = response,
      error: error => console.error(error)
    })
  }

  onSortChange(event: any) {
    this.shopParams.pageNumber = 1;
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          // console.log(result);
          this.shopParams.pageNumber = 1;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.brands = result.selectedBrands;
          this.getProducts();
        }
      },
    });
  }

  handlePageEvent(event: PageEvent) { // pozove se svaki put kad korisnik klikne Next/Previous ili kad izabere drugu velicinu strane(5,10,20)
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }
}
