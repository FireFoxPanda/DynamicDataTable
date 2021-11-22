({
  init: function (component, event, helper) {
    helper.getDatableInfo(component);
  },
  handlePreviousPage: function (component, event, helper) {
    component.set("v.pageNumber", component.get("v.pageNumber") - 1);
    helper.displayPaginationRecords(component);
  },

  handleNextPage: function (component, event, helper) {
    component.set("v.pageNumber", component.get("v.pageNumber") + 1);
    helper.displayPaginationRecords(component);
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
    var selectedRows = event.getParam("selectedRows");
    component.set("v.selectedRows", selectedRows);
    component.set("v.noOfselecteRows", selectedRows.length);
  },

  handleChange: function (component, event, helper) {
    // This will contain the string of the "value" attribute of the selected option
    var selectedOptionValue = event.getParam("value");
    component.set("v.pageSize", selectedOptionValue);
    let searchedData = component.get("v.searchedData");
    helper.setPagination(component, searchedData);
  }
});
