({
  init: function (component, event, helper) {
    helper.getDatableInfo(component);
  },
  handlePreviousPage: function (component, event, helper) {
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");
    console.log("Pre Selected rows  ", component.get("v.preSelectedRows"));
    component.set("v.pageNumber", component.get("v.pageNumber") - 1);
    component.set("v.hasPageChanged", true);
    helper.displayPaginationRecords(component);
    /*   preSelectedRows = [...new Set([...currentPageRows, ...preSelectedRows])];
    component.set("v.preSelectedRows", preSelectedRows);
    component.set("v.selectedRows", preSelectedRows); */
    helper.setSelectedRows(component);
  },

  handleNextPage: function (component, event, helper) {
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");
    console.log("Pre Selected rows  ", component.get("v.preSelectedRows"));
    component.set("v.pageNumber", component.get("v.pageNumber") + 1);
    component.set("v.hasPageChanged", true);
    helper.displayPaginationRecords(component);
    /*  currentPageRows.forEach(function (row) {
      if (!preSelectedRows.includes(row)) {
        preSelectedRows.push(row);
      }
    }); */
    /*  preSelectedRows = [...new Set([...currentPageRows, ...preSelectedRows])];
    component.set("v.preSelectedRows", preSelectedRows);

    component.set("v.selectedRows", preSelectedRows); */
    helper.setSelectedRows(component);
  },

  handleRecordsPerPage: function (component, event, helper) {
    helper.setPagination(component, component.get("v.searchedData"));
  },

  handleSearch: function (component, event, helper) {
    const searchKey = event.target.value.toLowerCase();
    console.log("searchKey --> ", searchKey);
  },
  handleSort: function (component, event, helper) {
    helper.handleSort(component, event);
  },

  handleRowSelection: function (component, event) {
    var a = event.getParam("selectedRows");
    var selectedRows = [];
    a.forEach(function (row) {
      selectedRows.push(row.Id);
    });
    console.log("selectedRows  ", selectedRows);
    var isPageChanged = component.get("v.hasPageChanged");
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");

    if (isPageChanged) {
      preSelectedRows = preSelectedRows.filter(
        (item) => !selectedRows.includes(item)
      );
      currentPageRows = selectedRows;
      component.set("v.currentPageRows", currentPageRows);
      component.set("v.preSelectedRows", preSelectedRows);
      component.set("v.hasPageChanged", false);
    } else {
      currentPageRows = selectedRows;

      const unique = [...new Set([...currentPageRows, ...preSelectedRows])];
      let noOfselectedRecords = unique.length;
      component.set("v.noOfselecteRows", noOfselectedRecords);
      component.set("v.currentPageRows", currentPageRows);
      console.log("currentPageRows  ", component.get("v.currentPageRows"));
    }
  },

  handleChange: function (component, event, helper) {
    // This will contain the string of the "value" attribute of the selected option
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");

    var selectedOptionValue = event.getParam("value");
    component.set("v.pageSize", selectedOptionValue);
    let searchedData = component.get("v.searchedData");
    helper.setPagination(component, searchedData);
    /* preSelectedRows = [...new Set([...currentPageRows, ...preSelectedRows])];
    component.set("v.preSelectedRows", preSelectedRows);
    component.set("v.selectedRows", preSelectedRows); */
    helper.setSelectedRows(component);
  },

  handleSearch: function (component, event, helper) {
    component.set("v.hasPageChanged", true);
    /*  var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");
    preSelectedRows = [...new Set([...currentPageRows, ...preSelectedRows])];
    component.set("v.preSelectedRows", preSelectedRows);
    component.set("v.selectedRows", preSelectedRows); */

    helper.searchRecordsBySearchPhrase(component);
    helper.setSelectedRows(component);
  }
});
