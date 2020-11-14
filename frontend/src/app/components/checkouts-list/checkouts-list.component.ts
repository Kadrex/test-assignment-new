import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../models/page';
import { Checkout } from '../../models/checkout';
import { CheckoutService } from '../../services/checkout.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

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
    // https://stackblitz.com/edit/mattable-with-sorting-custom?file=app%2Ftable-sorting-example.ts
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
    // https://stackoverflow.com/questions/57700078/angular-material-mat-table-not-returning-any-results-upon-filter
    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    }
  }

  nestedFilterCheck(search, data, key) {
    // https://stackoverflow.com/questions/57700078/angular-material-mat-table-not-returning-any-results-upon-filter
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  applyFilter(event: Event) {
    // https://material.angular.io/components/table/examples
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
