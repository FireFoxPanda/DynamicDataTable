import { LightningElement, track, wire } from "lwc";
import getDatableInfo from "@salesforce/apex/DynamicDataTableHelper.getDatableInfo";

export default class DynamicDataTable extends LightningElement {
  sobjectName = "Account";
  fieldList = "name,";
  @track dataTableInfo;
  @track dataTableRecords;

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
}
