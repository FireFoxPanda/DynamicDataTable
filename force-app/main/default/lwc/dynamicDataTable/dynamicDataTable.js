import { LightningElement, track, wire, api } from "lwc";
import getDatableInfo from "@salesforce/apex/DynamicDataTableHelper.getDatableInfo";

export default class DynamicDataTable extends LightningElement {
  sobjectName = "Account";
  fieldList = "name,";
  @track dataTableInfo;
  @track dataTableRecords;
  defaultSortDirection = "asc";
  sortDirection = "asc";
  sortedBy;
  @api pageSizeOptions = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" }
  ];
  totalRecords = 0; //Total no.of records
  pageSize = 5;
  totalPages = 0; //Total no.of pages
  pageNumber = 1; //Page number
  hidePrevious = true;
  hideNext = false;
  shownRecords = []; //Records to be displayed on the page
  firstRecord;
  lastRecord;
  columns;

  @wire(getDatableInfo, {
    sobjApiName: "Account",
    columnFields: "name,accountsource"
  })
  wiredData({ error, data }) {
    if (data) {
      this.dataTableInfo = data;
      this.columns = data.lstDataTableColumnProperties;

      this.totalRecords = data.lstDataTableRecords.length;

      this.dataTableRecords = data.lstDataTableRecords;
      this.displayPaginationRecords();
    }
  }

  sortBy(field, reverse, primer) {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    return function (a, b) {
      a = key(a);
      b = key(b);
      return reverse * ((a > b) - (b > a));
    };
  }

  onHandleSort(event) {
    const { fieldName: sortedBy, sortDirection } = event.detail;
    const cloneData = [...this.dataTableRecords];
    console.log(cloneData);
    cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));
    this.dataTableRecords = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
    this.displayPaginationRecords();
  }

  handleRecordsPerPage(event) {
    this.pageSize = event.target.value;
    this.displayPaginationRecords();
  }

  handlePreviousPage() {
    this.pageNumber = this.pageNumber - 1;
    this.displayPaginationRecords();
  }
  handleNextPage() {
    this.pageNumber = this.pageNumber + 1;
    this.displayPaginationRecords();
  }

  displayPaginationRecords() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.setPaginationControls();

    this.firstRecord = (this.pageNumber - 1) * this.pageSize;
    this.endingRecord = this.pageSize * this.pageNumber;
    //Edge Case
    this.endingRecord =
      this.endingRecord > this.totalRecountCount
        ? this.totalRecountCount
        : this.endingRecord;
    console.log("this.firstRecord == ", this.firstRecord);
    console.log("this.endingRecord == ", this.endingRecord);
    this.shownRecords = this.dataTableRecords.slice(
      this.firstRecord,
      this.endingRecord
    );
    console.log(this.shownRecords);
  }

  setPaginationControls() {
    if (this.totalPages === 1) {
      this.hidePrevious = true;
      this.hideNext = true;
    } else if (this.totalPages > 1) {
      this.hidePrevious = false;
      this.hideNext = false;
    }
    if (this.pageNumber <= 1) {
      this.pageNumber = 1;
      this.hidePrevious = true;
    } else if (this.pageNumber >= this.totalPages) {
      this.pageNumber = this.totalPages;
      this.hideNext = true;
    }
  }
}
