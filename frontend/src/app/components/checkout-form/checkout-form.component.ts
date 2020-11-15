import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Checkout } from '../../models/checkout';
import { CheckoutService } from '../../services/checkout.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookStatus } from '../../models/book-status';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
  providers: [DatePipe]
})
export class CheckoutFormComponent implements OnInit {

  private NEW_CHECKOUT: string = 'New checkout';
  private EDIT_CHECKOUT: string = 'Edit checkout';
  private SNACKBAR_ACTION: string = 'Close';
  private BOOK_STATUS_BORROWED: BookStatus = 'BORROWED';

  public checkout: Checkout;
  public checkoutIsLoaded: boolean = false;
  public pageTitle: string;
  public dueDate: Date;
  public fromDate: Date = new Date();

  constructor(
    private checkoutService: CheckoutService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private bookService: BookService) {
  }

  ngOnInit(): void {
    this.setCheckout();
  }

  setCheckout(): void {
    if (window.location.pathname.substr(15, 3) === 'new') {
      this.initializeNewCheckout();
      this.checkoutIsLoaded = true;
      this.pageTitle = this.NEW_CHECKOUT;
    } else {
      this.route.params.subscribe(res => {
        this.checkoutService.getCheckout(res.id).subscribe(res => {
          this.checkout = res as Checkout;
          this.checkoutIsLoaded = true;
          this.dueDate = new Date(this.checkout.dueDate)
          this.fromDate = new Date(this.checkout.checkedOutDate)
        })
      });
      this.pageTitle = this.EDIT_CHECKOUT
    }
  }

  initializeNewCheckout(): void {
    this.checkout = {id: null, borrowerFirstName: '', borrowerLastName: '',
      dueDate: null, checkedOutDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'), borrowedBook: null};
    this.route.params.subscribe(res => {
      this.bookService.getBook(res.id).subscribe(res => this.checkout.borrowedBook = res as Book)
    });
    this.checkout.id = this.generateId();
  }

  generateId(): string {
    let id = '';
    const chars = 'abcdef0123456789';
    const hyphenIndexes = [8, 13, 18, 23];
    for (let i = 0; i < 36; i++) {
      if (hyphenIndexes.indexOf(i) != -1) {
        id += '-';
      } else {
        id += chars[Math.floor(Math.random() * chars.length)]
      }
    }
    return id;
  }

  isCheckoutValid(): boolean {
    return !(!this.checkout.borrowerFirstName || !this.checkout.borrowerLastName || !this.dueDate || !this.fromDate);
  }

  saveCheckout(goTo: string): void {
    this.checkout.dueDate = this.datePipe.transform(this.dueDate, 'yyyy-MM-dd');
    this.checkout.checkedOutDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    this.checkout.borrowedBook.status = this.BOOK_STATUS_BORROWED;
    this.checkout.borrowedBook.checkOutCount += 1;
    this.checkoutService.saveCheckout(this.checkout).subscribe(() => {
      window.location.href = goTo;
    });
    this.bookService.saveBook(this.checkout.borrowedBook).subscribe();
    let message;
    if (this.pageTitle == this.NEW_CHECKOUT) {
      message = 'Book successfully checked out.';
    } else {
      message = 'Checkout successfully updated.';
    }
    this.showSnackbar(message);
  }

  saveCheckoutAndView(): void {
    if (this.checkDates()) {
      this.saveCheckout('/checkouts/' + this.checkout.id);
    }
  }

  saveCheckoutAndTable(): void {
    if (this.checkDates()) {
      this.saveCheckout('/checkouts');
    }
  }

  checkDates(): boolean {
    if (this.fromDate > this.dueDate) {
      this.showSnackbar('Due date has to be after date checked out.');
      return false;
    }
    return true;
  }

  showSnackbar(message: string): void {
    // https://material.angular.io/components/snack-bar/overview
    this.snackBar.open(message, this.SNACKBAR_ACTION, {
      duration: 3000
    });
  }

}
