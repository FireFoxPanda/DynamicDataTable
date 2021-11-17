import { LightningElement, track, wire } from "lwc";
import getDatableInfo from "@salesforce/apex/DynamicDataTableHelper.getDatableInfo";

export default class DynamicDataTable extends LightningElement {
  sobjectName = "Account";
  fieldList = "name,";
  @track dataTableInfo;
  @track dataTableRecords;
  defaultSortDirection = "asc";
  sortDirection = "asc";
  sortedBy;

  columns;

  @wire(getDatableInfo, {
    sobjApiName: "Account",
    columnFields: "name,accountsource"
  })
  wiredData({ error, data }) {
    if (data) {
      this.dataTableInfo = data;
      this.columns = data.lstDataTableColumnProperties;
      this.dataTableRecords = data.lstDataTableRecords;
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
  }
}
