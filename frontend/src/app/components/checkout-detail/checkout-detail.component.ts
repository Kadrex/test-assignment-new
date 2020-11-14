import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { CheckoutService } from '../../services/checkout.service';
import { Checkout } from '../../models/checkout';
import { BookService } from '../../services/book.service';
import { BookStatus } from '../../models/book-status';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.scss']
})
export class CheckoutDetailComponent implements OnInit {

  private BOOK_STATUS_RETURNED: BookStatus = 'RETURNED';
  private dialogText: string = 'Do you really wish to return this book?';
  public overdueText: string;
  public checkout$: Observable<Checkout | Error>;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private bookService: BookService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.checkout$ = this.route.params
      .pipe(map(params => params.id))
      .pipe(switchMap(id => this.checkoutService.getCheckout(id)))
  }

  openDialog(id, book): void {
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {text: this.dialogText
      }});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.returnBook(id, book)
      }
    })
  }

  returnBook(id, book): void {
    book.status = this.BOOK_STATUS_RETURNED;
    this.bookService.saveBook(book).subscribe();
    this.checkoutService.deleteCheckout(id).subscribe();
    window.location.href = '/checkouts';
  }

  isOverdue(dueDateString: string): boolean {
    // https://stackoverflow.com/questions/58930825/difference-between-two-dates-in-days-using-angular
    let currentDate = new Date();
    let dueDate = new Date(dueDateString);
    let daysOverdue = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      - Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()) ) /(1000 * 60 * 60 * 24));
    let days = ' days';
    if (daysOverdue === 1) {
      days = ' day';
    }
    this.overdueText = 'Overdue by ' + daysOverdue + days;
    return daysOverdue > 0;
  }

}
