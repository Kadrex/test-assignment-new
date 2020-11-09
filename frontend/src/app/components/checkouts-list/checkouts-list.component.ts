import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './checkouts-list.component.html',
  styleUrls: ['./checkouts-list.component.scss']
})
export class CheckoutsListComponent implements OnInit {

  checkouts$: Observable<Page<Checkout> | Error>;

  constructor(
    private checkoutService: CheckoutService,
  ) {
  }

  ngOnInit(): void {
    this.checkouts$ = this.checkoutService.getCheckouts();

  }

}
