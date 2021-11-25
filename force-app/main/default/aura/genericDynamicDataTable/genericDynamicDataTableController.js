({
  init: function (component, event, helper) {
    helper.getDatableInfo(component);
  },
  handlePreviousPage: function (component, event, helper) {
    component.set("v.pageNumber", component.get("v.pageNumber") - 1);
    component.set("v.hasPageChanged", true);
    helper.displayPaginationRecords(component);

    helper.setSelectedRows(component);
  },

  handleNextPage: function (component, event, helper) {
    component.set("v.pageNumber", component.get("v.pageNumber") + 1);
    component.set("v.hasPageChanged", true);
    helper.displayPaginationRecords(component);
    helper.setSelectedRows(component);
  },

  handleRecordsPerPage: function (component, event, helper) {
    helper.setPagination(component, component.get("v.searchedData"));
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
    var selectedOptionValue = event.getParam("value");
    component.set("v.pageSize", selectedOptionValue);
    let searchedData = component.get("v.searchedData");
    helper.setPagination(component, searchedData);
    helper.setSelectedRows(component);
  },

  handleSearch: function (component, event, helper) {
    component.set("v.hasPageChanged", true);
    helper.searchRecordsBySearchPhrase(component);
    helper.setSelectedRows(component);
  },
  handleSelecetdRows: function (component, event, helper) {
    let lines = [];
    lines = component.get("v.selectedRows");
    console.log(JSON.stringify(lines));
  }
});
