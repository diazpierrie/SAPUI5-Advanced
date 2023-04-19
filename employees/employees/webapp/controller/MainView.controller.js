sap.ui.define(
  ["sap/ui/core/mvc/Controller",
"sap/ui/model/Filter",
"sap/ui/model/FilterOperator"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.model.Filter} Filter
   * @param {typeof sap.ui.model.FilterOperator} FilterOperator
   */
  function (Controller, Filter, FilterOperator) {
    "use strict";

    function onInit() {
      var oJsonModel = new sap.ui.model.json.JSONModel();
      var oView = this.getView();
      var i18nBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      // var oJSON = {
      //   employeeId: "12345",
      //   countryKey: "UK",
      //   listCountry: [
      //     {
      //       key: "US",
      //       text: i18nBundle.getText("countryUS"),
      //     },
      //     {
      //       key: "UK",
      //       text: i18nBundle.getText("countryUK"),
      //     },
      //     {
      //       key: "ES",
      //       text: i18nBundle.getText("countryES"),
      //     },
      //   ],
      // };

      // oJsonModel.setData(oJSON);
      // @ts-ignore
      oJsonModel.loadData("./localService/mockdata/Employees.json", false);
      // oJsonModel.attachRequestCompleted(function (oEventModel) {
      //   console.log(JSON.stringify(oJsonModel.getData()));        
      // })
      oView.setModel(oJsonModel);
    };

    function onFilter() {
      var oJSON = this.getView().getModel().getData();

      var filters = [];
      
      if (oJSON.EmployeeId !== "" ) {
        filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId ))
      }

      if (oJSON.CountryKey !== "" ) {
        filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey ))
      }

      var oList = this.getView().byId("tableEmployee");
      var oBinding = oList.getBinding("items");
      oBinding.filter(filters);
    };
    
    function onFilterClear() {
      var oModel = this.getView().getModel();
      oModel.setProperty("/EmployeeId", "");
      oModel.setProperty("/CountryKey", "");

      var filters = [];
      var oList = this.getView().byId("tableEmployee");
      var oBinding = oList.getBinding("items");
      oBinding.filter(filters);
    };

    var Main = Controller.extend(
      "logaligroup.employees.controller.MainView",
      {}
    );

    (Main.prototype.onInit = function () {}),
      (Main.prototype.onValidate = function () {
        var inputEmployee = this.getView().byId("inputEmployee");
        var valueEmployee = inputEmployee.getValue();

        if (valueEmployee.length === 6) {
          inputEmployee.setDescription("OK");

          this.getView().byId("labelCountry").setVisible(true);
          this.getView().byId("slCountry").setVisible(true);
        } else {
          inputEmployee.setDescription("Not OK");

          this.getView().byId("labelCountry").setVisible(false);
          this.getView().byId("slCountry").setVisible(false);
        }
      });

    Main.prototype.onInit = onInit;
    Main.prototype.onFilter = onFilter;
    Main.prototype.onFilterClear = onFilterClear;
    return Main;
  }
);
