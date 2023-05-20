sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",

  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller

   */
  function (Controller, ) {
    "use strict";

    function onInit() {
      var oView = this.getView();
      var i18nBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      var oJsonModelEmployees = new sap.ui.model.json.JSONModel();
      oJsonModelEmployees.loadData(
        "./localService/mockdata/Employees.json",
        // @ts-ignore
        false
      );
      oView.setModel(oJsonModelEmployees, "employees");
    }

    

    var Main = Controller.extend(
      "logaligroup.employees.controller.EmployeeDetails",
      {}
    );

    (Main.prototype.onInit = function () {});
    Main.prototype.onInit = onInit;

    return Main;
  }
);
