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

      var oJsonModelCountries = new sap.ui.model.json.JSONModel();
      oJsonModelCountries.loadData(
        "./localService/mockdata/Countries.json",
        // @ts-ignore
        false
      );
      oView.setModel(oJsonModelCountries, "countries");

      var oJsonModelLayout = new sap.ui.model.json.JSONModel();
      oJsonModelLayout.loadData(
        "./localService/mockdata/Layout.json",
        // @ts-ignore
        false
      );
      oView.setModel(oJsonModelLayout, "layout");

      var oJsonModelConfig = new sap.ui.model.json.JSONModel({
        visibleID: true,
        visibleName: true,
        visibleCountry: true,
        visibleCity: true,
        visibleBtnShowCity: false,
        visibleBtnHideCity: true,
      });
      oView.setModel(oJsonModelConfig, "config");

      this._bus = sap.ui.getCore().getEventBus();

      this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this)
    }

    function showEmployeeDetails(category, nameEvent, path) {
      var detailView = this.getView().byId("detailEmployeeView");
      detailView.bindElement("employees>" + path)
      this.getView().getModel("layout").setProperty("/ActiveKey", "TwoColumnsMidExpanded")      
    }

    var Main = Controller.extend(
      "logaligroup.employees.controller.Main",
      {}
    );

    (Main.prototype.onInit = function () {});
    Main.prototype.onInit = onInit;
    Main.prototype.showEmployeeDetails = showEmployeeDetails;

    return Main;
  }
);
