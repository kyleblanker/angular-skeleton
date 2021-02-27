import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../_services/api.service';
import { Sort } from '@angular/material/sort';
import { TableOptions } from '../../_components/table/table.component';
import { HttpResponse } from '@angular/common/http';
import { Example } from 'src/app/_models/example.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tableData: Array<Example> = [];
  tableOptions: TableOptions = {
    columns:  [
      {def: "name", title: "Name"},
      {def: "string", title: "String"},
      {def: "date", title: "Date"}
    ],
    sortColumn: "pressure",
    sortDirection: "desc",
    pageSize: 5,
    page: 0,
    total: 0,
    loading: false
  }

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getTableData();
  }

  updateTablePagination(event:PageEvent): void {
    if(this.tableOptions.pageSize != event.pageSize) {
      this.tableOptions.page = 0;
    } else {
      this.tableOptions.page = event.pageIndex;
    }
    this.tableOptions.pageSize = event.pageSize;

    this.getTableData();
  }

  // Listens to sorting changes and refreshes the data in that order.
  sortTableData(event: Sort): void {
    this.tableOptions.sortColumn = event.active;
    this.tableOptions.sortDirection = event.direction;
    this.getTableData();
  }

  getTableData(): void {
    this.tableOptions.loading = true;

    let queryString = {
      sortColumn: this.tableOptions.sortColumn,
      sortDirection: this.tableOptions.sortDirection,
      pageSize: this.tableOptions.pageSize,
      page: this.tableOptions.page+1
    };

    this.apiService.makeRequest('get','/data', queryString).subscribe(response => {
      if(response instanceof HttpResponse) {
        this.tableData = [];
        response.body.data.forEach((data: any) => {
          this.tableData.push(new Example(data));
        });
        this.tableOptions.total = response.body.total;
        this.tableOptions.loading = false;
      }
    });
  }
}
