import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './checkouts-list.component.html',
  styleUrls: ['./checkouts-list.component.scss']
})
export class CheckoutsListComponent implements OnInit, AfterViewInit {

  pageSizeOptions: number[] = [10, 15, 20, 50];
  displayedColumns: string[] = ['book', 'borrower', 'dueDate'];
  dataSource: MatTableDataSource<Checkout> = new MatTableDataSource<Checkout>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
  ) {
  }

  ngOnInit(): void {
    this.checkoutService.getCheckouts({pageIndex: 0, pageSize: 5000})
      .subscribe(res => {
        let x = res as Page<Checkout>;
        this.dataSource.data = x.content
      })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'book': {
          return item['borrowedBook']['title'];
        }
        case 'borrower': {
          return  item['borrowerFirstName'] + ' ' + item['borrowerLastName']
        }
        default: {
          return item[property];}
      }
    };
  }
}
