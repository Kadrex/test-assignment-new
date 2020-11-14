import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookDetailComponent, DialogData } from '../book-detail/book-detail.component';

@Component({
  selector: 'confirmation-dialog.component',
  templateUrl: 'confirmation-dialog.component.html',
  styleUrls: ['confirmation-dialog.component.scss']
})
export class ConfirmationDialog {

  constructor(
    public dialogRef: MatDialogRef<BookDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  onNoClick(): void {
    // https://material.angular.io/components/dialog/overview
    this.dialogRef.close()
  }

}
