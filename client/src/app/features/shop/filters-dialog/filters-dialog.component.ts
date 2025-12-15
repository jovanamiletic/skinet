import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShopService } from '../../../core/services/shop.service';
import { MatSelectionList, MatListOption, MatDivider } from "@angular/material/list";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-dialog',
  imports: [MatSelectionList, MatListOption, MatDivider,FormsModule],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss',
})
export class FiltersDialogComponent {//Ovaj child nije u HTML-u parenta, već je “dinamički”.
  private dialogRef = inject(MatDialogRef<FiltersDialogComponent>); //daje ti kontrolu nad otvorenim dialogom(mozes da ga zatvoris;mozes da vratis podatke parent-u)
  parentData = inject(MAT_DIALOG_DATA); //podaci koje je parent poslao prilikom otvaranja dialoga
  shopService = inject(ShopService); //dialog direktno koristi servis da dobije listu svih tipova i brendova

  //lokalni STATE dialoga (ovo ne menja odmah STATE parent-a; parent se menja tek kad se dialog zatvori)
  //referenca na parent state (menja se odmah dok je dialog otvoren)
  newSelectedBrands: string[] = this.parentData.selectedBrands;
  newSelectedTypes: string[] = this.parentData.selectedTypes;

  applyFilters() {//poziva se kad korisnik klikne apply
    this.dialogRef.close({ //close() salje objekat parent komponenti
      selectedBrands: this.newSelectedBrands,
      selectedTypes: this.newSelectedTypes
    }); 
  }
}
