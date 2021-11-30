({
  init: function (component, event, helper) {
    helper.getDatableInfo(component);
    component.set("v.originalMaxRowSelection", component.get("v.maxRowSelection"));
    var currentPageRows = component.get("v.currentPageRows");
    var preSelectedRows = component.get("v.preSelectedRows");
    var selectedRows = component.get("v.selectedRows");

    /* if (sessionStorage) {
      if (sessionStorage.getItem("validationfailed")) {
        if (sessionStorage.getItem("selectedRows")) {
          component.set("v.selectedRows", sessionStorage.getItem("selectedRows"));
          console.log("selectedRows , ", component.get("v.selectedRows"));
        }

        if (sessionStorage.getItem("preSelectedRows")) {
          component.set("v.preSelectedRows", sessionStorage.getItem("preSelectedRows"));
          console.log("preSelectedRows , ", component.get("v.preSelectedRows"));
        }

        if (sessionStorage.getItem("currentPageRows")) {
          component.set("v.currentPageRows", sessionStorage.getItem("currentPageRows"));
          console.log("currentPageRows , ", component.get("v.currentPageRows"));
        }
      }
    } */

    component.set("v.validate", function () {
      helper.setSelectedRows(component);
      var allSelectedRows = component.get("v.selectedRows");
      helper.showError();
      console.log("allSelectedRows ", allSelectedRows);
      var preSelectedRows = component.get("v.preSelectedRows");
      console.log("preSelectedRows ", preSelectedRows);
      if (allSelectedRows.length < 1) {
        /*   if (sessionStorage) {
          //Set the input values into sessionStorage
          sessionStorage.setItem("validationfailed", true);
          sessionStorage.setItem("selectedRows", component.get("v.selectedRows"));
          sessionStorage.setItem("currentPageRows", component.get("v.currentPageRows"));
          sessionStorage.setItem("preSelectedRows", component.get("v.preSelectedRows"));
        }
        // If the component is valid...
        return { isValid: false, errorMessage: "" };
      } else if (allSelectedRows.length > 5) {
        if (sessionStorage) {
          //Set the input values into sessionStorage
          sessionStorage.setItem("validationfailed", true);
          sessionStorage.setItem("selectedRows", component.get("v.selectedRows"));
          sessionStorage.setItem("currentPageRows", component.get("v.currentPageRows"));
          sessionStorage.setItem("preSelectedRows", component.get("v.preSelectedRows"));
        }
        // If the component is valid...
        return { isValid: false, errorMessage: "Greater than 5" }; */
        return { isValid: false, errorMessage: "" };
      } else {
        /* if (sessionStorage) {
          sessionStorage.removeItem("validationfailed");
          sessionStorage.removeItem("selectedRows");
          sessionStorage.removeItem("currentPageRows");
          sessionStorage.removeItem("preSelectedRows");
        }
        // If the component is invalid... */
        return { isValid: true };
      }
    });
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
      // currentPageRows = selectedRows;
      component.set("v.currentPageRows", currentPageRows);
      //helper.setSelectedRows(component);
    }
    const uniqueRecords = [...new Set([...currentPageRows, ...preSelectedRows])];
    component.set("v.noOfselecteRows", uniqueRecords.length);
    //helper.setSelectedRows(component);
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
  },

  handleNavigate: function (cmp, event) {
    console.log("Navigate Component");
    var navigate = cmp.get("v.navigateFlow");
    navigate(event.getParam("action"));
  }
});
