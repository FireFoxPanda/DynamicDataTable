({
  init: function (component, event, helper) {
    helper.getDatableInfo(component);
  },
  handlePreviousPage: function (component, event, helper) {
    let pageNumber = component.get("v.pageNumber") - 1;
    component.set("v.pageNumber", pageNumber);
    //component.set("v.pageNumber", component.get("v.pageNumber") - 1);
    component.set("v.hasPageChanged", true);
    helper.displayPaginationRecords(component);

    helper.setSelectedRows(component);
    let pageSize = component.get("v.pageSize");
    let startingPageRowNo = (pageNumber - 1) * pageSize;
    component.set("v.startingPageRowNo", startingPageRowNo);
  },

  handleNextPage: function (component, event, helper) {
    let pageNumber = component.get("v.pageNumber") + 1;
    component.set("v.pageNumber", pageNumber);
    component.set("v.hasPageChanged", true);
    helper.displayPaginationRecords(component);
    helper.setSelectedRows(component);
    let pageSize = component.get("v.pageSize");
    let startingPageRowNo = (pageNumber - 1) * pageSize;
    component.set("v.startingPageRowNo", startingPageRowNo);
  },

  handleRecordsPerPage: function (component, event, helper) {
    helper.setPagination(component, component.get("v.searchedData"));
  },

  handleSort: function (component, event, helper) {
    helper.handleSort(component, event);
  },

  handleRowSelection: function (component, event) {
    var selectRows = event.getParam("selectedRows");
    var selectedRows = [];
    selectedRows = selectRows.map((row) => row.Id);

    var isPageChanged = component.get("v.hasPageChanged");
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");
    currentPageRows = selectedRows;

    if (isPageChanged) {
      preSelectedRows = preSelectedRows.filter((item) => !selectedRows.includes(item));
      component.set("v.currentPageRows", currentPageRows);
      component.set("v.preSelectedRows", preSelectedRows);
      component.set("v.hasPageChanged", false);
    } else {
      currentPageRows = selectedRows;
      component.set("v.currentPageRows", currentPageRows);
    }
    const uniqueRecords = [...new Set([...currentPageRows, ...preSelectedRows])];
    component.set("v.noOfselecteRows", uniqueRecords.length);
  },

  handlePageSize: function (component, event, helper) {
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
  }
});
