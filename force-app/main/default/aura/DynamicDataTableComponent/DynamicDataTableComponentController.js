({
  init: function (component, event, helper) {
    helper.getDatableInfo(component);
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");
    var selectedRows = component.get("v.selectedRows");

    component.set("v.validate", function () {
      helper.setSelectedRows(component);
      var allSelectedRows = component.get("v.selectedRows");

      var preSelectedRows = component.get("v.preSelectedRows");
      if (allSelectedRows.length < 1) {
        helper.showError();
        return { isValid: false, errorMessage: "" };
      } else {
        // If the component is invalid... */
        return { isValid: true };
      }
    });
  },
  handlePreviousPage: function (component, event, helper) {
    let pageNumber = component.get("v.pageNumber") - 1;
    component.set("v.pageNumber", pageNumber);
    component.set("v.hasPageChanged", true);
    helper.displayPaginationRecords(component);
    helper.setSelectedRows(component);
    let pageSize = component.get("v.pageSize");
    let startingPageRowNo = (pageNumber - 1) * pageSize;
    component.set("v.startingPageRowNo", startingPageRowNo);
    helper.isPageChanged(component);
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
    helper.isPageChanged(component);
  },

  handleRecordsPerPage: function (component, event, helper) {
    helper.setPagination(component, component.get("v.searchedData"));
  },

  handleSort: function (component, event, helper) {
    helper.handleSort(component, event);
    helper.setSelectedRows(component);
  },

  handleRowSelection: function (component, event, helper) {
    var selectRows = event.getParam("selectedRows");
    var selectedRows = [];
    selectedRows = selectRows.map((row) => row.Id);

    var isPageChanged = component.get("v.hasPageChanged");
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");
    currentPageRows = selectedRows;

    if (!isPageChanged) {
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
    helper.setRowNo(component);
  },

  handleSearch: function (component, event, helper) {
    component.set("v.hasPageChanged", true);
    helper.searchRecordsBySearchPhrase(component);
    helper.setSelectedRows(component);
    helper.setRowNo(component);
  }
});
