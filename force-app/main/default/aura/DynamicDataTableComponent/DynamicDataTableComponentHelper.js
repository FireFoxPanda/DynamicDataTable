({
  getDatableInfo: function (component, helper) {
    var action = component.get("c.getDatableInfo");
    var sobjApiNameVal = component.get("v.sobjApiName");
    var fieldList = component.get("v.fieldList");

    console.log(sobjApiNameVal);
    console.log(fieldList);
    action.setParams({
      sobjApiName: sobjApiNameVal,
      columnFields: fieldList
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      console.log("state ", state);
      if (state === "SUCCESS") {
        var data = response.getReturnValue();
        console.log("data ", data);
        if (data) {
          console.log("data ", data);
          component.set("v.allData", data.lstDataTableRecords);
          component.set("v.searchedData", data.lstDataTableRecords);
          component.set("v.columns", data.lstDataTableColumnProperties);

          component.set("v.showPagination", "true");

          this.setPagination(component, data.lstDataTableRecords);
        }
      } else {
        $A.get("e.force:showToast")
          .setParams({
            message: "FAILED",
            type: "error"
          })
          .fire();
      }
    });
    $A.enqueueAction(action);
  },

  setPagination: function (component, allData) {
    let countTotalPage = Math.ceil(
      allData.length / component.get("v.pageSize")
    );
    let totalPages = countTotalPage > 0 ? countTotalPage : 1;
    component.set("v.totalPages", totalPages);
    component.set("v.totalRecords", allData.length);

    component.set("v.pageNumber", 1);
    this.displayPaginationRecords(component);
  },

  displayPaginationRecords: function (component) {
    let paginationData = [];
    let pageNumber = component.get("v.pageNumber");
    let pageSize = component.get("v.pageSize");
    let searchedData = component.get("v.searchedData");
    let x = (pageNumber - 1) * pageSize;
    for (; x < pageNumber * pageSize; x++) {
      if (searchedData[x]) {
        paginationData.push(searchedData[x]);
      }
    }
    component.set("v.shownRecords", paginationData);
  },

  sortBy: function (field, reverse, primer) {
    var key = primer
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
  },

  handleSort: function (component, event) {
    var sortedBy = event.getParam("fieldName");
    var sortDirection = event.getParam("sortDirection");

    var cloneData = component.get("v.allData");
    cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));

    component.set("v.searchedData", cloneData);
    component.set("v.sortDirection", sortDirection);
    component.set("v.sortedBy", sortedBy);
    this.setPagination(component, component.get("v.searchedData"));
  },

  searchRecordsBySearchPhrase: function (component) {
    let searchKey = component.get("v.searchPhrase").toLowerCase();
    let allData = component.get("v.allData");
    let searchedData = [];
    if (searchKey) {
      searchedData = allData.filter((record) =>
        JSON.stringify(record)
          .replace(/\s+/g, " ")
          .toLowerCase()
          .includes(searchKey)
      );
      component.set("v.searchedData", searchedData);
      this.setPagination(component, searchedData);
    } else {
      searchedData = allData;
      component.set("v.searchedData", searchedData);
      //this.totalRecords = this.originalRecords.length;
      this.setPagination(component, searchedData);
    }
  },

  setSelectedRows: function (component) {
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");
    preSelectedRows = [...new Set([...currentPageRows, ...preSelectedRows])];
    component.set("v.preSelectedRows", preSelectedRows);
    component.set("v.selectedRows", preSelectedRows);
  }
});