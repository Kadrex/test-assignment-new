import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { CheckoutService } from '../../services/checkout.service';
import { Page } from '../../models/page';
import { Checkout } from '../../models/checkout';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookStatus } from '../../models/book-status';

@Component({
  selector: 'app-late-checkouts-list',
  templateUrl: './late-checkouts-list.component.html',
  styleUrls: ['./late-checkouts-list.component.scss'],
  providers: [DatePipe]
})
export class LateCheckoutsListComponent implements OnInit {

  private BOOK_STATUS_RETURNED: BookStatus = 'RETURNED';
  private SNACKBAR_ACTION: string = 'Close';
  private dialogText: string = 'Are you sure you wish to return that book?';
  public lateCheckouts: Checkout[] = [];

  constructor(
    private bookService: BookService,
    private checkoutService: CheckoutService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.checkoutService.getCheckouts({pageIndex: 0, pageSize: 5000})
      .subscribe(res => {
        let x = res as Page<Checkout>;
        this.lateCheckouts = this.getOnlyLateCheckouts(x.content);
      })
  }

  getOnlyLateCheckouts(allCheckouts: Checkout[]): Checkout[] {
    let lateCheckouts = [];
    for (const checkout of allCheckouts) {
      if (checkout.dueDate < this.datePipe.transform(new Date(), 'yyyy-MM-dd')) {
        lateCheckouts.push(checkout);
      }
    }
    // sort array of objects https://stackoverflow.com/questions/51194830/sort-array-of-object-by-object-field-in-angular-6
    lateCheckouts.sort((c1, c2) => c1.dueDate.localeCompare(c2.dueDate));
    return lateCheckouts;
  }

  daysOverdue(dueDateString: string): number {
    // https://stackoverflow.com/questions/58930825/difference-between-two-dates-in-days-using-angular
    let currentDate = new Date();
    let dueDate = new Date(dueDateString);
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      - Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  openDialog(id, book): void {
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {text: this.dialogText
      }});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.returnBook(id, book);
      }
    })
  }

  returnBook(id, book): void {
    book.status = this.BOOK_STATUS_RETURNED;
    this.bookService.saveBook(book).subscribe();
    this.checkoutService.deleteCheckout(id).subscribe();
    this.lateCheckouts = this.lateCheckouts.filter(c => c.id != id);
    this.showSnackbar('Book successfully returned.');
  }

  showSnackbar(message: string): void {
    // https://material.angular.io/components/snack-bar/overview
    this.snackBar.open(message, this.SNACKBAR_ACTION, {
      duration: 3000
    });
  }

}
